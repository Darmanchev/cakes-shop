import type { OrderFieldErrors, OrderFormField } from "./order.types";

export function getOrderFieldAccessibility(
  errors: OrderFieldErrors,
  field: OrderFormField,
) {
  const invalid = Boolean(errors[field]?.length);

  return {
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${field}-error` : undefined,
  } as const;
}
