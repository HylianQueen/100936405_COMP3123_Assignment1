# COMP 3123 Assignment 1: Employee Management REST API

Zelda Pelletier, Student ID 100936405

This project is a REST API for managing employees. It is built with Node.js, Express and MongoDB. A user signs up, logs in to get a JWT, and then uses that token to manage their own employee records. Every employee belongs to the user who created it, so no other user can read, change or delete it.

## Tech used

- Node.js 22 and Express 5
- MongoDB (local) with Mongoose 9
- bcryptjs for password hashing
- jsonwebtoken for login tokens
- express-validator for input validation
- helmet for security headers
- express-rate-limit for rate limiting
- morgan and a small custom logger for request and event logs
- dotenv for environment variables

## Project structure

```
config/db.js                 MongoDB connection
controllers/                 userController.js, employeeController.js
middleware/                  auth.js, validate.js, errorHandler.js, rateLimiter.js
models/                      User.js, Employee.js
routes/                      userRoutes.js, employeeRoutes.js
utils/logger.js              writes logs to the console and logs/app.log
validators/                  userValidator.js, employeeValidator.js
postman/                     Postman collection with status code tests
app.js                       Express app setup
server.js                    starts the server
.env.example                 example environment variables
```

## How to run it

1. Install Node.js and MongoDB Community Server. Make sure MongoDB is running on the default port.
2. Install the packages:

```
npm install
```

3. Copy `.env.example` to a new file called `.env` and fill in a real `JWT_SECRET`. A random one can be made with this command:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

4. Start the server:

```
node server.js
```

The API runs at `http://localhost:3000`. It uses a database called `comp3123_assignment1`, which MongoDB creates by itself the first time data is saved.

## Environment variables

| Name | What it does | Example |
| --- | --- | --- |
| PORT | Port the server listens on | 3000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/comp3123_assignment1 |
| JWT_SECRET | Secret used to sign and check tokens | a long random string |
| JWT_EXPIRES_IN | How long a token lasts | 1h |

The `.env` file is listed in `.gitignore` so the secret never reaches GitHub. Only `.env.example` is in the repo.

## Endpoints

### User

| Method | Path | Success | Purpose |
| --- | --- | --- | --- |
| POST | /api/v1/user/signup | 201 | Create an account |
| POST | /api/v1/user/login | 200 | Log in and get a JWT |

Signup body:

```json
{ "username": "zeeA", "email": "zee.a@example.com", "password": "Password1984" }
```

Login body. It needs either `username` or `email`, plus `password`:

```json
{ "username": "zeeA", "password": "Password1984" }
```

Login returns `{ "message": "...", "token": "<jwt>" }`.

### Employee

Every employee route needs the header `Authorization: Bearer <token>`.

| Method | Path | Success | Purpose |
| --- | --- | --- | --- |
| GET | /api/v1/emp/employees | 200 | List my employees |
| POST | /api/v1/emp/employees | 201 | Create an employee |
| GET | /api/v1/emp/employees/:eid | 200 | Get one of my employees |
| PUT | /api/v1/emp/employees/:eid | 200 | Update one of my employees |
| DELETE | /api/v1/emp/employees?eid=xxx | 204 | Delete one of my employees |

Create body:

```json
{
  "first_name": "Ava",
  "last_name": "Stone",
  "email": "ava.stone@example.com",
  "position": "Developer",
  "salary": 65000,
  "date_of_joining": "2024-03-15",
  "department": "Engineering"
}
```

For PUT, any of these fields can be sent on its own.

### Health check

`GET /health` returns the server status, the database connection state and the uptime in seconds. It does not need a token.

## Status codes

| Code | When |
| --- | --- |
| 200 | Successful read, update or login |
| 201 | Successful signup or employee creation |
| 204 | Successful delete, with no body |
| 400 | Validation failed, bad id format or malformed JSON |
| 401 | Missing, invalid or expired token, or wrong login details |
| 403 | The employee exists but belongs to another user |
| 404 | Employee or route not found |
| 409 | Username or email already exists |
| 429 | Too many requests |
| 500 | Unexpected server error |

Errors are always sent as JSON. For example: `{ "status": false, "message": "Validation failed", "errors": [ { "field": "email", "message": "..." } ] }`.

## Authentication and authorization

Authentication proves who the user is. On signup, the password is hashed with bcryptjs (10 rounds) before it is saved, so the real password is never stored. The password field is also hidden from database queries by default. On login, bcrypt compares the password with the saved hash and the server returns a signed JWT that holds the user id. An unknown user and a wrong password get the same 401 message, so an attacker cannot tell which usernames exist.

Authorization decides what the user is allowed to do. The `auth` middleware runs on every employee route. It checks the Bearer token, confirms the user still exists, and puts the user id on the request. The owner of a new employee always comes from the token and never from the request body, so a client cannot create records for someone else. The list route only returns employees where `user` matches the logged in user. For get, update and delete by id, the server returns 404 if the employee does not exist and 403 if it belongs to a different user.

## Security measures

- Passwords are hashed with bcrypt and never returned in a response.
- Tokens expire, and the secret stays in `.env`.
- Helmet sets secure HTTP headers.
- Rate limiting allows 20 signup or login requests per 15 minutes and 300 API requests per 15 minutes for each IP. Going over the limit returns a 429.
- Every route validates its input. Fields are checked as strings before any database query, so object style NoSQL injection is rejected with a 400.
- Create and update only accept a fixed list of employee fields.
- A central error handler hides internal details. An unexpected error returns a generic 500 "Internal server error", and the real error only goes to the log.
- `.env`, `node_modules` and the logs folder are not committed.

## Logging

Requests and important events are written to the console and to `logs/app.log`. Each line has a timestamp and a level (INFO, WARN or ERROR). The log records the request method, path, status code and response time. It also records signups and logins (username only), validation failures (field names only), auth failures, forbidden access attempts, rate limit hits and server errors. It never records passwords, tokens or password hashes. The `logs` folder is in `.gitignore`.

## Testing with Postman

The `postman/` folder has a collection with 40 requests in 7 folders. It covers signup, login, validation errors, auth errors, ownership checks, 404s and deletes. Each request has a test that checks the expected status code.

1. Import `postman/COMP3123 Assignment 1.postman_collection.json` into Postman.
2. Start the server.
3. Run the collection with the Collection Runner. It saves the two login tokens and the employee ids into collection variables by itself.

To run it a second time, start from an empty database. Drop `comp3123_assignment1` in Compass and restart the server, because the signups return a 409 when the users already exist.

The collection uses two test accounts: `zeeA` with the password `Password1984` and `zeeB` with the password `Password1985`. They are only for local testing.

I showed the 429 response by sending the `Login wrong password` request many times in a row. The 500 response is not triggered by any normal request, because every known problem becomes a 400, 401, 403, 404 or 409 first. Only the central error handler returns a 500, and only for an unexpected error.

Overall, the API keeps each user's employee data private, validates all input, and logs what happens without leaking secrets.
