const mongoose = require("mongoose");

let usersDBConnection;

const connectDatabase = async () => {
  try {
    // Connect to usersDB
    usersDBConnection = await mongoose.connect(process.env.USERS_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected To Excess Labs User's DB, server: ${usersDBConnection.connection.host}`);

    // // Connect to collectionsDB
    // collectionsDB = await mongoose.createConnection(process.env.USERS_COLLECTION_DB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    // console.log(`Connected To Excess Labs User's Collections DB, server: ${collectionsDB.host}`);
    // console.log(conn)
    // return { usersDB: true, collectionsDB: true, collectionsDBConnection: collectionsDB };
    return { usersDB: true };
  } catch (err) {
    console.log("Error While Connecting To Databases....");
    console.log(err);
    return { usersDB: false, collectionsDB: false };
  }
};


module.exports = {
  connectDatabase
};
