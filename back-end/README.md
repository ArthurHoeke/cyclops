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

| Function                          | Method     | URI                                      | Parameters                                                       |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|
| `register`                        | `POST`     | `users/register`                         | `email (string)` `password (string)`                             |
| `login`                           | `POST`     | `users/login`                            | `email (string)` `password (string)`                             |

#### Network

| Function                          | Method     | URI                                      | Parameters                                                       |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|
| `create`                          | `POST`     | `network/create`                         | `name (string)` `ticker (string)` `icon (base64 string)`         |
| `remove`                          | `POST`     | `network/remove`                         | `id (integer)`                                                   |
| `getList`                         | `GET`      | `network/list`                           |                                                                  |

#### Validator

| Function                          | Method     | URI                                      | Parameters                                                       |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|
| `add`                             | `POST`     | `validator/add`                          | `address (string)` `id (integer)`                                |
| `remove`                          | `POST`     | `validator/remove`                       | `id (integer)`                                                   |
| `getList`                         | `GET`      | `validator/list`                         |                                                                  |

#### Reward

| Function                          | Method     | URI                                      | Parameters                                                       |
|-----------------------------------|------------|------------------------------------------|------------------------------------------------------------------|
| `getAllRewardsFromValidator`      | `GET`      | `reward/getAllRewardsFromValidator`      | `id (integer)`                                                   |
| `getRewardsFromValidatorInPeriod` | `GET`      | `reward/getRewardsFromValidatorInPeriod` | `id (integer)` `start (unixtime string)` `end (unixtime string)` |       

#### Event

#### Subscan

#### SMTP

### Utils
Contains common re-used functions as well as third-party API logic.

### Config
Contains configuration variables for third-party API keys as well as SMTP.
