const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const {
  AppRouter
} = require('./routes');
const {
  ErrorsMiddleware,
  VersionMiddleware,
  LoggingMiddleware
} = require('./middlewares');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

console.log('NODE_ENV', process.env.NODE_ENV);


app.use(bodyParser.json({

}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/coverage', express.static('coverage/lcov-report'));
app.use(VersionMiddleware);
if (process.env.NODE_ENV !== 'test')
  app.use(LoggingMiddleware);

app
  .use(AppRouter)
  .use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  })
  .use(ErrorsMiddleware);

module.exports = app; // for testing