import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {MAX_ORDER_ADVANCE_DAYS, parseCreateOrderInput} from './order.schema';

function dateInSofia(days: number) {
    const formatted = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Sofia',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
    const date = new Date(`${formatted}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

function validOrder() {
    return {
        name: 'Иван Петров',
        phone: '0888 123 456',
        email: 'ivan@example.com',
        items: [{
            productId: 'cake-1',
            quantity: '2',
            comment: '',
        }],
        date: dateInSofia(7),
        deliveryType: 'DELIVERY',
        deliveryAddress: 'ул. Витоша 1',
        comment: '',
    };
}

describe('create order validation', () => {
    it('normalizes a valid Bulgarian phone, quantity, and manually entered date', () => {
        const result = parseCreateOrderInput(validOrder());
        assert.equal(result.success, true);
        if (result.success) {
            assert.equal(result.data.phone, '+359888123456');
            assert.equal(result.data.items[0].quantity, 2);
        }
    });

    it('accepts dates typed as DD.MM.YYYY', () => {
        const result = parseCreateOrderInput({
            ...validOrder(),
            date: dateInSofia(7).split('-').reverse().join('.'),
        });

        assert.equal(result.success, true);
        if (result.success) assert.equal(result.data.date, dateInSofia(7));
    });

    it('accepts multiple products with separate comments', () => {
        const result = parseCreateOrderInput({
            ...validOrder(),
            items: [
                {productId: 'cake-1', quantity: '1', comment: 'Без орехи'},
                {productId: 'cake-2', quantity: '2', comment: 'Надпис: Честит рожден ден'},
            ],
        });

        assert.equal(result.success, true);
        if (result.success) {
            assert.equal(result.data.items.length, 2);
            assert.equal(result.data.items[1].quantity, 2);
        }
    });

    it('rejects orders beyond the maximum advance window', () => {
        const result = parseCreateOrderInput({
            ...validOrder(),
            date: dateInSofia(MAX_ORDER_ADVANCE_DAYS + 1),
        });
        assert.equal(result.success, false);
        if (!result.success) assert.ok(result.fieldErrors.date?.length);
    });

    it('requires a delivery address and rejects unknown input', () => {
        const result = parseCreateOrderInput({
            ...validOrder(),
            deliveryAddress: '',
            injected: '<script>',
        });
        assert.equal(result.success, false);
    });
});
