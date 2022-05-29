# `@sl/server`
This is a server lol

## 🚊 Routes
See `swagger.yaml`

## 🔨 Installation & Instructions
Do you wish to use this code?
Please follow the following instructions on how to set everything up.

**Pre-requisites:**
- Clone this repository
- Run npm install or yarn install
    - Use the sample below as a `.env` or `.env.local` boilerplate.
      Don't share the value of your variables publicly as these include critical information.
      ```text
      # Express App Server Details
      APP_PORT=9000
      APP_BASE_URL=http://localhost:%s
      APP_CORS_ORIGIN=http://localhost:3000
      
      # Postgres & TypeORM Connection Options
      DB_HOST=localhost
      DB_PORT=5432
      DB_USERNAME=postgres
      DB_PASSWORD=postgres
      DB_NAME=sollad
      DB_SYNC=true
      ```

## 👨‍🎓 Learnings

### Server-Sent-Events (SSE)
- https://www.youtube.com/watch?v=piEYV-fsYbA
- https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app

### Error Handler Middleware
> https://www.becomebetterprogrammer.com/how-to-use-error-handler-middleware-with-express-js-and-typescript/

### TypeORM Relations between Tables
- Many to Many: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations
- One to Many: https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations

### Postgres

#### Login
```shell
psql -U postgres
```