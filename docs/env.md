# Environment

Обязательные production-переменные окружения:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/stas_cakes_shop"
ADMIN_PASSWORD_HASH="scrypt$base64url-salt$base64url-hash"
ADMIN_TOTP_SECRET="BASE32_SECRET_FROM_AUTHENTICATOR_APP"
RATE_LIMIT_SECRET="случайная-строка-минимум-32-байта"
ORDER_RETENTION_DAYS="365"
```

Для локального старта скопируй `.env.example` в `.env` и укажи реальную строку подключения.

`ADMIN_PASSWORD_HASH` создаётся интерактивной командой `npm run admin:hash-password` — пароль не попадает в историю shell.
`ADMIN_TOTP_SECRET` создаётся командой `npm run admin:generate-totp-secret`; этот base32-секрет нужно добавить в приложение-аутентификатор.
Заказы старше `ORDER_RETENTION_DAYS` автоматически удаляются при создании нового заказа и загрузке списка в админке.
