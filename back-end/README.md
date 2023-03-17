# Cyclops Back-end

The cyclops back-end server runs on [expressjs.com](https://expressjs.com/) version 4.18.2.


## Installation

Run `npm i` to install all packages.

## Run server

Run `npm start` to start the server. Navigate to `http://localhost:3000/`.

## Run test

Run `npm test` to test the webservice and database functionality.

*Note: this function will test the API end-points and database functionality using dummy data, make sure that there is no `database.db` file created yet before starting the test. After the test has been completed, the newly generated `database.db` will be deleted.*

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
| `sync`                            | `GET`      | `reward/sync`                            | `id (validator ID integer)`                                      | `0`   |
| `getWeeklyRewardsFromValidator`   | `GET`      | `reward/getWeeklyRewardsFromValidator`   | `id (validator ID integer)`                                      | `0`   |
| `getMonthlyRewardsFromValidator`  | `GET`      | `reward/getMonthlyRewardsFromValidator`  | `id (validator ID integer)`                                      | `0`   |
| `getYearlyRewardsFromValidator`   | `GET`      | `reward/getYearlyRewardsFromValidator`   | `id (validator ID integer)`                                      | `0`   |
| `getCombinedWeeklyRewards`        | `GET`      | `reward/getCombinedWeeklyRewards`        |                                                                  | `0`   |
| `getValidatorRewardOverview`      | `GET`      | `reward/getValidatorRewardOverview`      | `id (validator ID integer)`                                      | `0`   |

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
