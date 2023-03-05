# Cyclops Back-end

The cyclops back-end server runs on [expressjs.com](https://expressjs.com/) version 4.18.2.

## Run server

Run `node app.js` to start the server. Navigate to `http://localhost:3000/`.

## Source structure

### Controllers
Contains all functions used by the API.

### Middleware
Contains routing middleware, such as authentication.

### Models
Contains database logic and functionality.

### Routes
Contains all end-points implementing controller functionality.

#### User

| Function      | Method     | URI              | Parameters                                                       | Role  |
|---------------|------------|------------------|------------------------------------------------------------------|-------|
| `register`    | `POST`     | `users/register` | `email (string)` `password (string)`                             | `0`   |
| `login`       | `POST`     | `users/login`    | `email (string)` `password (string)`                             | `0`   |

#### Network

| Function                          | Method     | URI                                      | Parameters                                                       | Role  |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|-------|
| `create`                          | `POST`     | `network/create`                         | `name (string)` `ticker (string)` `icon (base64 string)`         | `0`   |
| `remove`                          | `POST`     | `network/remove`                         | `id (network ID integer)`                                        | `0`   |
| `getList`                         | `GET`      | `network/list`                           |                                                                  | `0`   |

#### Validator

| Function                          | Method     | URI                                      | Parameters                                                       | Role  |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|-------|
| `add`                             | `POST`     | `validator/add`                          | `address (string)` `id (network ID integer)`                     | `0`   |
| `remove`                          | `POST`     | `validator/remove`                       | `id (network ID integer)`                                        | `0`   |
| `getList`                         | `GET`      | `validator/list`                         |                                                                  | `0`   |

#### Reward

| Function                          | Method     | URI                                      | Parameters                                                       | Role  |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|-------|
| `getAllRewardsFromValidator`      | `GET`      | `reward/getAllRewardsFromValidator`      | `id (validator ID integer)`                                      | `0`   |
| `getRewardsFromValidatorInPeriod` | `GET`      | `reward/getRewardsFromValidatorInPeriod` | `id (validator ID integer)` `start (unixtime string)` `end (unixtime string)` | `0`   |

#### Event

| Function                          | Method     | URI                                      | Parameters                                                       | Role  |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|-------|
| `get`                             | `GET`      | `event/get`                              | `id (validator ID integer)`                                      | `0`   |
| `remove`                          | `POST`     | `event/remove`                           | `id (event ID integer)` `validatorId (validator ID integer)`     | `0`   |

#### Config

| Function                          | Method     | URI                                      | Parameters                                                       | Role  |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|-------|
| `setSMTP`                         | `POST`     | `config/setSMTP`                         | `smtpHost (string)` `smtpPort (integer)` `smtpUsername (string)` `smtpPassword (string)` | `1`   |
| `setSubscanApiKey`                | `POST`      | `config/setSubscanApiKey`               | `subscanApiKey (string)` | `1`   |
| `list`                | `GET`      | `config/list`               |  | `1`   |

### Utils
Contains common re-used functions as well as third-party API logic.

### Services
Contains logic for timed functionality such as validator reward syncing et cetera.

## Database
<img src="https://raw.githubusercontent.com/ArthurHoeke/cyclops/development/back-end/assets/database_diagram.png">
