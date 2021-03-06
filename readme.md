# BLACKOUTS Hub

<p align="center">
  <img src="https://raw.githubusercontent.com/blackouts-dev/brand/master/blackouts.png" width="320" alt="BLACKOUTS Logo" />
</p>

Server hub for other BLACKOUTS services.
Handles RabbitMQ message processing and the API for the frontend.

## Running

You should run this using the [Docker Compose stack](https://github.com/blackouts-dev/stack) we have setup.

Make sure to populate the `hub.env` file to supply the following environment variables:

- `POSTGRES_URI`
- `DATABASE_SYNCHRONIZE`
- `TYPEORM_LOGGING`
- `RABBITMQ_URI`

## Contributing

### Installation

```sh
yarn install
```

### Running the app

```sh
# Development
yarn run start

# Watch mode
yarn run start:dev

# Production mode
yarn run start:prod
```

### Test

```sh
# Unit tests
yarn run test

# E2E tests
yarn run test:e2e

# Test coverage
yarn run test:cov
```
