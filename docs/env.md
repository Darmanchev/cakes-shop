# Environment

Обязательные production-переменные окружения:

```env
DATABASE_URL="postgresql://user:password@db.example.com:5432/stas_cakes_shop?sslmode=verify-full"
ADMIN_PASSWORD_HASH="scrypt:base64url-salt:base64url-hash"
ADMIN_TOTP_SECRET="BASE32_SECRET_FROM_AUTHENTICATOR_APP"
RATE_LIMIT_SECRET="случайная-строка-минимум-32-байта"
PII_ENCRYPTION_KEY="base64url-ключ-ровно-32-байта"
TRUSTED_PROXY_IP_HEADER="x-real-ip"
ORDER_RETENTION_DAYS="365"
```

Для локального старта скопируй `.env.example` в `.env` и укажи реальную строку подключения.

`ADMIN_PASSWORD_HASH` создаётся интерактивной командой `npm run admin:hash-password` — пароль не попадает в историю shell.
`ADMIN_TOTP_SECRET` создаётся командой `npm run admin:generate-totp-secret`; этот base32-секрет нужно добавить в приложение-аутентификатор.
`RATE_LIMIT_SECRET` и `PII_ENCRYPTION_KEY` должны быть независимыми случайными ключами. `PII_ENCRYPTION_KEY` можно создать командой `openssl rand -base64 32 | tr '+/' '-_' | tr -d '='`. Потеря ключа сделает персональные данные нечитаемыми, поэтому он должен храниться в secret manager и резервироваться отдельно от БД.
`TRUSTED_PROXY_IP_HEADER` — единственный заголовок с IP, которому доверяет приложение. Coolify/Traefik должен перезаписывать `x-real-ip` одним валидным IP, а прямой сетевой доступ к контейнеру должен быть запрещён. В production отсутствие настройки останавливает обработку, а запрос без валидного proxy IP получает `503`; общий bucket не используется.
An order is automatically deleted during order creation or admin-list loading
only when both its creation timestamp and requested fulfilment date are older
than `ORDER_RETENTION_DAYS`.

В production строка `DATABASE_URL` обязана включать `sslmode=verify-full`. Резервные копии PostgreSQL также должны шифроваться отдельным KMS/backup-ключом и иметь проверяемую политику удаления.

Перед production-запуском `npm start` автоматически выполняет `npm run env:check`. После первой установки этой версии задай постоянный `PII_ENCRYPTION_KEY` и выполни `npm run pii:encrypt-existing`, чтобы зашифровать строки старых заказов; команда идемпотентна и не запускается без ключа.

Production startup applies no catalog seed. Run `npm run db:migrate:deploy` as
a release step, then run `npm run db:seed` separately only for a new database or
an intentional catalog synchronization.

`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are optional, but they must either
both be configured or both be empty so notification failures are not hidden by
an incomplete setup.
