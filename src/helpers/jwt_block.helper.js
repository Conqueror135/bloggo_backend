import jwt from "jsonwebtoken";

const generateToken = (user, secretSinanture, tokenLife) =>
  new Promise((resolve, reject) => {
    const userData = {
      _id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
    };
    jwt.sign(
      { data: userData },
      secretSinanture,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        return resolve(token);
      },
    );
  });
const verifyToken = (bearToken, secretKey) => {
  const token = bearToken.replace(/^Bearer\s/, "");
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      return resolve(decoded);
    });
  });
};
export default {
  generateToken,
  verifyToken,
};
