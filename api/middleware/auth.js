const { ValidateSignature } = require("../../utils");
const Customer = require("../../database/models/User");

module.exports = async (req, res, next) => {
  try {
    const isAuthorized = await ValidateSignature(req);

    if (isAuthorized) {
      return next();
    }

    return res.status(403).json({ message: "Not Authorized" });
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

