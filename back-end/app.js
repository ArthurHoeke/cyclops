const express = require('express');
const bodyParser = require('body-parser')

var config = require('./app/Config/config');

var eventRouter = require('./app/Routes/event.routes');
var networkRouter = require('./app/Routes/network.routes');
var rewardRouter = require('./app/Routes/reward.routes');
var userRouter = require('./app/Routes/user.routes');
var validatorRouter = require('./app/Routes/validator.routes');

const app = express()
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/validator', validatorRouter);
app.use('/user', userRouter);
app.use('/reward', rewardRouter);
app.use('/network', networkRouter);
app.use('/event', eventRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    message: "Route does not exist."
  })
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err
  })
});



app.listen(port, () => {
  console.log(`
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣠⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⣰⣿⣿⡿⠟⠋⠁⣀⣀⣀⣀⡀⠉⠛⢿⣿⣿⣧⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⢰⣿⡿⠋⣀⣴⣾⠿⠛⠛⠛⠛⠻⠿⣦⣄⠙⢿⣿⣇⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⣿⣿⣥⣾⠟⠉⣠⣴⠾⠟⠛⣿⣶⣦⣈⠙⢷⣦⣻⣿⡄⠀⠀⠀⠀
  ⠀⠀⠀⠀⠸⢿⣿⡿⠃⣠⣾⠟⠁⠀⠀⣾⣿⣿⣿⣿⣷⡀⠹⣿⣿⠇⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⣾⣟⠁⣼⣿⡏⠀⢀⣶⠟⠛⠿⣿⡿⠉⣿⣿⡆⠘⣿⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⢠⣼⣿⣦⠈⢿⡇⠀⣿⡃⠀⠀⠀⢸⡇⠀⣿⠟⢀⣾⣿⡄⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⣿⣟⠻⣷⣄⠁⠀⠘⢷⣤⣤⣴⠟⠁⠀⢁⣴⡿⢻⣿⠃⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠸⣿⣦⡈⠻⢷⣦⣄⣀⠀⠀⢀⣀⣤⣶⠟⠋⣰⣿⡟⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠹⣿⣿⣦⣀⠉⠙⠛⠛⠛⠛⠛⠉⢀⣤⣾⣿⡟⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣶⣦⣤⣤⣤⣶⣾⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  \nCyclops back-end listening on port ${port}`);
})