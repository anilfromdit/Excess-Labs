const express = require('express');
const usersRouter = require('./../routes/users');
const appRouter = require('./../routes/apps')
const collectionRouter = require('./collection')
const app = express();

app.use('/', usersRouter);
app.use('/app', appRouter)
app.use('/collection',collectionRouter)
module.exports = app;
