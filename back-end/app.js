const express = require('express');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

database = new sqlite3.Database("./database.db");
const config = require("./app/Models/config.models");

var eventRouter = require('./app/Routes/event.routes');
var networkRouter = require('./app/Routes/network.routes');
var rewardRouter = require('./app/Routes/reward.routes');
var userRouter = require('./app/Routes/user.routes');
var validatorRouter = require('./app/Routes/validator.routes');
var configRouter = require('./app/Routes/config.routes');

var dataUtils = require('./app/Utils/data.utils');

var validatorService = require('./app/Services/validator.services');

const app = express()
const port = 3000;

//global config variables
JWT_SECRET = null;
SUBSCAN_APIKEY = null;
SMTP_HOST = null;
SMTP_PORT = null;
SMTP_USERNAME = null;
SMTP_PASSWORD = null;

//setup routes for Express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/validator', validatorRouter);
app.use('/user', userRouter);
app.use('/reward', rewardRouter);
app.use('/network', networkRouter);
app.use('/event', eventRouter);
app.use('/config', configRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: "Route does not exist."
  })
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err
  })
});

//check if config table is present, if not perform initial setup
config.getConfig((err, data) => {
  if(data == undefined) {
      console.log("\x1b[90m \n👋 Initial setup detected! Tips:\x1b[33m\n");
      console.log("1. The first account to be registered automatically gets the administrator role / access to settings.");
      console.log("2. Configure the subscan API key and (optional) SMTP details via the front-end settings page.\n\x1b[0m");
      JWT_SECRET = dataUtils.generateRandomHash();

      config.setupConfigRow([JWT_SECRET]);
  } else {
      JWT_SECRET = data.jwtSecret;
      SUBSCAN_APIKEY = data.subscanApiKey;

      SMTP_HOST = data.smtpHost;
      SMTP_PORT = data.smtpPort;
      SMTP_USERNAME = data.smtpUsername;
      SMTP_PASSWORD = data.smtpPassword;
  }
});

app.listen(port, () => {
  console.log(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣤⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠞⠛⣉⡉⠄⠀⠀⠀⠀⠀⠐⠯⣛⡳⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⢛⡡⠔⠚⣉⡀⠄⠀⠀⠒⠀⠀⠀⠀⠀⠀⠈⠓⠪⣝⡳⢤⣀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣀⡴⢛⡥⢒⡩⠔⣒⣩⡥⠶⠖⠚⠛⠛⠓⠶⠦⢤⣄⣈⠑⠢⢄⡀⠉⠲⢝⠳⣤⡀⠀⠀⠀⠀
  ⠀⠀⠀⠀⢀⣤⠞⢉⣔⡯⢒⣥⠶⠛⣉⣤⣶⣶⣿⣿⣿⣿⣿⣿⠿⢷⣾⣯⣟⡶⣤⣈⠲⠀⠀⠑⢬⠙⢦⡀⠀⠀
  ⠀⠀⢀⡴⠟⠁⣴⢟⣡⡾⢋⣥⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣤⡈⠻⣿⣿⣿⣯⣻⣦⣅⡀⠀⠀⠀⠙⢷⣄
  ⣠⡼⠋⠀⠀⣠⡴⣛⣥⣾⣿⣿⣿⢿⡟⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡇⢸⠻⣿⣿⣿⣿⣮⣿⡦⠀⠀⠀⠀⠉
  ⠉⠀⠀⣠⣾⣯⡾⠟⠋⠀⢻⣿⣿⠘⡇⠙⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠃⣼⠀⣾⠉⡏⢸⡟⠛⠛⣷⠀⢰⡀⠀
  ⠀⠀⣨⣷⡟⢹⠀⠀⠀⠀⠀⠈⢻⣆⠹⡄⠀⠈⠛⠿⣿⣿⣿⣿⠿⣫⠎⡰⠃⣼⠃⠘⠁⣼⠁⣠⣾⡏⠀⠼⠁⠀
  ⠀⠸⣿⣽⣷⣤⣄⡀⠀⡀⠀⠀⠀⠙⠷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠈⣡⠞⣡⠞⠁⠀⠀⢀⣡⣾⣿⠋⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠉⠙⠳⢮⣗⣦⣀⣀⠀⠈⠙⠷⠶⢤⣤⣤⣤⣤⡾⠿⠛⠁⠀⢀⣠⣶⣿⡿⢋⣰⠆⡀⠀⠀⠀⠀
  ⠀⠙⠛⠛⠛⠳⢦⣄⡀⠀⠈⠙⠻⠾⢿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⣶⣿⠿⠛⢉⣤⠞⣡⠞⠁⠀⠀⠀⠀
  ⠀⠀⠀⠀⢠⡳⢤⣉⠛⠳⠶⣤⣄⣀⡀⠀⠉⠙⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉⢀⣠⡶⠋⣡⠞⡡⠚⣡⠊⠀⠀⠀
  ⠀⠀⠀⠀⠰⣝⡳⠮⣭⠂⠀⠀⠈⠉⠙⢛⠶⠶⢶⣤⣤⣄⣀⣀⣠⣤⣴⠶⠟⠋⠁⠰⠋⠕⣊⠴⠂⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠀⠀⠀⠈⠓⣖⡒⠂⠠⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠦⠭⠭⠭⠤⠵⠒⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`);
  console.log(`\nCyclops listening on port ${port}`);
});