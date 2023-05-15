const { badRequest, unauthenticatedError } = require("../errorHandler");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authenticateMiddleWare = async (req, res, next) => {
  const reqHeaders = req.headers.authorization;

  if (!reqHeaders) {
    throw new unauthenticatedError("Unauthorized to access this route");
  }
  if (reqHeaders.startsWith("Bearer")) {
    const token = reqHeaders.split(" ")[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken) {
          const { userID, username } = decodedToken;
          req.user = { userID, username };
          return next();
        }
      } catch (error) {
        throw error;
      }
    }
  }
  throw new unauthenticatedError(
    "Not authorized to access this route, sorry ehn"
  );
};

module.exports = authenticateMiddleWare;
