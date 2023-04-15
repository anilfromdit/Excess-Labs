const app = require("./app");
const {connectDatabase} = require("./config/database");

//handling uncaught exception
process.on("uncaughtException", (error) => {
  console.log(`Error:${error.message}`);
  console.log("Shutting down server due to uncaught promise rejection");

  process.exit(1);
});



//Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

//handling unhandled Promise Rejection

process.on("unhandledRejection", (error) => {
  console.log(`Error:${error.message}`);
  console.log("Shutting down server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
