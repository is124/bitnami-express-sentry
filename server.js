const express = require('express');
const PORT = process.env.PORT || 4200;
const app = express();
const Sentry = require('@sentry/node');
const SentryTracing = require("@sentry/tracing");

// define Sentry DSN
Sentry.init({ 
    dsn: 'https://1de1f8cace334a54aa34d9e5fe8dcb5e@o567227.ingest.sentry.io/5744151',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new SentryTracing.Integrations.Express({app}),
    ],
    tracesSampleRate: 1.0,
    debug:true,
});

//Sentry middleware
app.use(Sentry.Handlers.requestHandler());

// route
app.get('/', function (req, res) {
  let x = Math.floor((Math.random() * 4) + 1);
  switch (x) {
    case 1:
      res.send('Hello, world\n');
      break;
    case 2:
      res.send('Have a good day, world\n');
      break;
    case 3:
      throw new Error('Insufficient memory');
      break;
    case 4:
      throw new Error('Cannot connect to source');
      break;
    }
});


//The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);