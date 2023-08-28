import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import getConfig from "../config/config";

const config = getConfig(process.env.NODE_ENV);

async function sendEmail(mailOptions) {
  try {
    const myOAuth2Client = new OAuth2Client(
      config.oauth2client.GOOGLE_MAILER_CLIENT_ID,
      config.oauth2client.GOOGLE_MAILER_CLIENT_SECRET,
    );
    myOAuth2Client.setCredentials({
      refresh_token: config.oauth2client.GOOGLE_MAILER_REFRESH_TOKEN,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.oauth2client.ADMIN_EMAIL_ADDRESS,
        clientId: config.oauth2client.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: config.oauth2client.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: config.oauth2client.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (e) {
    console.log(e);
  }
}
export default sendEmail;
