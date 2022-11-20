const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://hung:hung123@cluster0.bm5emny.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connect database successfully");
  } catch (error) {
    console.log("connect database failure ", error);
  }
}

module.exports = connectDatabase;
