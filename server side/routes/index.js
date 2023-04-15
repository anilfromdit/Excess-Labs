const express = require('express');
const usersRouter = require('./../routes/users');
const appRouter = require('./../routes/apps')
const app = express();

app.use('/', usersRouter);
app.use('/app', appRouter)

module.exports = app;
