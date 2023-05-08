const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/config.env" });
const errorMiddleware = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const indexRouter = require('./routes/index');
const os = require('os');
const {connectDatabase} = require("./config/database");
var cors = require('cors')
 
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Incoming Request:');
    console.log(`Method: ${req.method}`);
    console.log(`Endpoint: ${req.url}`);
    console.log(`Payload: ${JSON.stringify(req.body)}`);
    
    res.on('finish', () => {
      console.log('Outgoing Response:');
      console.log(`Status Code: ${res.statusCode}`);
      // console.log(`Payload: ${JSON.stringify(res.data)}`);
    //   console.log(res)
    });
    
    next();
  });

app.use("/api/v1", indexRouter);


app.get('/health', async (req, res, next) => {
    // const dbStatus = db.isConnected() ? 'Connected' : 'Disconnected';
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const databaseStatus = await connectDatabase();
    const memoryUsage = `${Math.round(usedMemory * 100) / 100} MB`;
    const cpuUsage = `${os.loadavg()[0].toFixed(2)}`;
    const freeMemory = `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
    const totalMemory = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
    
    return res.status(200).json({success: true,
        message: "SERVER HEALTH REPORT",
        version: process.env.SERVER_VERSION,
        databaseStatus,
        memoryUsage,
        cpuUsage,
        freeMemory,
        totalMemory})
    
  });

  
  
  
//Middleware for errors
app.use(errorMiddleware);

module.exports = app;
