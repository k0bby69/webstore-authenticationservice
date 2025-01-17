const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
require("dotenv").config();

module.exports.GeneratePassword = async (password) => {
  const hash = await bcrypt.hash(password, 8);
  return hash;
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword) => {
  const isPasswordMatch = await bcrypt.compare(enteredPassword, savedPassword);
  return isPasswordMatch;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "30d",
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    throw error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token missing from Authorization header");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = payload; // Attach user information to the request object
    return true;
  } catch (error) {
    console.error("Error validating signature:", error.message);
    return false;
  }
};

module.exports.FormatData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not Found!");
  }
};

// Message Broker

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();

    // Ensure the exchange exists
    await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
      durable: true,
    });

    return channel;
  } catch (err) {
    console.error("Error creating channel:", err);
    throw err;
  }
};

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    const appQueue = await channel.assertQueue(process.env.QUEUE_NAME, {
      durable: true,
    });

    channel.bindQueue(
      appQueue.queue,
      process.env.EXCHANGE_NAME,
      process.env.CUSTOMER_BINDING_KEY
    );

    channel.consume(appQueue.queue, (data) => {
      try {
        service.SubscribeEvents(data.content.toString());
        console.log("Received data:", data.content.toString());
        channel.ack(data);
      } catch (consumeError) {
        console.error("Error processing message:", consumeError);
      }
    });
  } catch (err) {
    console.error("Error subscribing to messages:", err);
    throw err;
  }
};
