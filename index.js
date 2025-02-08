const express = require("express");
const cors = require("cors");
const { CreateChannel, SubscribeMessage } = require("./utils");
const userRoutes = require("./api/user");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const print = console.log;
const port = process.env.PORT || 8001
dotenv.config();

const app = express();
app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:3000', 'https://multivendorplatform-shopping-frontend.onrender.com'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors())
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
