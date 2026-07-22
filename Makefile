APP_NAME := stas-cakes-shop
DB_CONTAINER := stas-cakes-postgres
DB_VOLUME := stas-cakes-postgres-data
DB_IMAGE := postgres:16
DB_PORT := 5435
DB_NAME := stas_cakes_shop
DB_USER := postgres
DB_PASSWORD := postgres
DATABASE_URL := postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:$(DB_PORT)/$(DB_NAME)

.PHONY: isntall dev build start lint db-generate db-migrate db-up db-down db-reset db-seed

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

db-generate:
	npm run db:generate

db-migrate:
	npm run db:migrate

db-up:
	docker run --name $(DB_CONTAINER) \
		-e POSTGRES_DB=$(DB_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-p 127.0.0.1:$(DB_PORT):5432 \
		-v $(DB_VOLUME):/var/lib/postgresql/data \
		-d $(DB_IMAGE)

db-down:
	docker rm -f $(DB_CONTAINER)

db-reset: db-down
	docker volume rm $(DB_VOLUME)

db-seed:
	npm run db:seed
