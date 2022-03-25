import mongoose from "mongoose";

export default class MongoConnector {
  constructor(dbname = "test", host = "localhost", port = 27017) {
    this.host = host;
    this.port = port;
    this.dbname = dbname;
  }

  connect() {
    mongoose.connect(
      `mongodb://${this.host}/${this.dbname}`,
      () => {
        console.log("\n[ MongoDB Connector ]");
        console.log("------------------------------------------");
        console.log(
          `Connected to database \'${this.dbname}' at ${this.host} on port ${this.port}.`
        );
        console.log("------------------------------------------");
      },
      (e) => {
        console.log("Error connecting to database.");
        console.log(e);
      }
    );
  }
}
