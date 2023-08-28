import CryptoJS from "crypto-js";
async function createIdentity(
  publicKey,
  privateKeyEncode,
  mspId,
  type,
  version,
  password
) {
  try { 
    const rawPrivateKey = CryptoJS.AES.decrypt(privateKeyEncode, password);
    const privateKey = rawPrivateKey.toString(CryptoJS.enc.Utf8);
    const identity = {
      credentials: {
        certificate: publicKey,
        privateKey: privateKey,
      },
      mspId,
      type,
      version
    };

    return identity;
  } catch (error) {
    console.log(error);
    return;
  }
}
export  {createIdentity};