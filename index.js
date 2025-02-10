const express = require("express");
const cors = require("cors");
const { CreateChannel, SubscribeMessage } = require("./utils");
const userRoutes = require("./api/user");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const print = console.log;
const port = process.env.PORT || 8001;
dotenv.config(); // Load environment variables from .env file

const app = express();

// Allow all origins by passing no options
app.use(cors());

app.use(express.json());
app.use(express.static(__dirname + "/public"));

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Connection sauce");

    const channel = await CreateChannel();

    await userRoutes(app, channel);

    app.listen(port, () => {
      console.log(`Customer is Listening to Port ${port}`);
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

startApp();
