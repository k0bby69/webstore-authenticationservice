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

// CORS configuration to handle preflight and allow only specific origins
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      'https://webstore-frontend-9669.onrender.com', // Production Frontend URL
      'http://localhost:3000' // Localhost URL (if running locally)
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Use CORS middleware with specific options
app.use(cors(corsOptions));

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
