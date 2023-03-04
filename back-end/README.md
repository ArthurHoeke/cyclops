# Cyclops Back-end

The cyclops back-end server runs on [expressjs.com](https://expressjs.com/) version 4.18.2.

## Source structure

### Controllers
Contains all functions used by the API.

### Middleware
Contains routing middleware, such as authentication.

### Models
Contains database logic and functionality.

### Routes
Contains all end-points implementing controller functionality.

### Utils
Contains common re-used functions as well as third-party API logic.

### Config
Contains configuration variables for third-party API keys as well as SMTP.

## Run server

Run `node app.js` to start the server. Navigate to `http://localhost:3000/`.