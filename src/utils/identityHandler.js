import { createIdentity } from "./walletHandler.js";
import md5 from "md5";
import CryptoJS from "crypto-js";
import { getPkiById } from "../models/pki/Pki.js";

const getAndBuildIdentity = async (username, password) => {
  try {
    const idUserRemover = md5(username);
    const idPkiRemover = md5(username + "pki");
    const pkiRemover = await getPkiById(idPkiRemover);
    if (pkiRemover.status) {
      const mspId = pkiRemover.data.mspId;
      const type = pkiRemover.data.type;
      const version = pkiRemover.data.version;

      const identity = await createIdentity(
        pkiRemover.data.publicKey,
        pkiRemover.data.privateKeyEncode,
        mspId,
        type,
        version,
        password
      );
      return {
        nameIdentity: idUserRemover,
        identity: identity,
      };
    }
  } catch (error) {}
};
const reEncodePrivateKey = async (
  privateKeyEncode,
  oldPassword,
  newPassword
) => {
  try {
    const rawPrivateKey = CryptoJS.AES.decrypt(privateKeyEncode, oldPassword);
    const privateKey = rawPrivateKey.toString(CryptoJS.enc.Utf8);

    const newPrivateKeyEncode = CryptoJS.AES.encrypt(
      privateKey,
      newPassword
    ).toString();
    return newPrivateKeyEncode;
  } catch (error) {
    return;
  }
};
export {
  getAndBuildIdentity,
  reEncodePrivateKey,
};
