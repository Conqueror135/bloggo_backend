import jwt from "jsonwebtoken";

const generateToken = (user, secretSinanture, tokenLife) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,

        type: user.type,
        role: user.role,
        access_role: user.access_role,
        is_deleted: user.is_deleted,
        active: user.active,
      },
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
        console.log(error);
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
