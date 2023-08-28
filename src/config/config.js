const DEFAULT_DB_URI = "mongodb://thangdz:thang18cm@localhost:27017/bloggo?authSource=admin";

const config = {
  production: {
    host_admin: "http://localhost:4200",
    secret: "BLOGGO135104",
    username_admin: "sysadmin",
    name_admin: "Bloggo",
    phone_admin: "0364448661",
    email_admin: "duythang135104@gmail.com",
    main_folder: "dist",
    MONGO_URI: process.env.MONGO_URI || DEFAULT_DB_URI,
    port: process.env.PORT || 27017,
    mail: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "vothuong1351043@gmail.com",
      },
    },
    oauth2client: {
      GOOGLE_MAILER_CLIENT_ID: "707514970461-gdn1qmra429vndmn9uqgnkmlk1ehehu5.apps.googleusercontent.com",
      GOOGLE_MAILER_CLIENT_SECRET: "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",
      GOOGLE_MAILER_REFRESH_TOKEN:
        "1//04aJToMz5Gt6lCgYIARAAGAQSNwF-L9IrrUOVmazhVE7k2RHUuCB6YTxrK4XuF7jGk4uRb6ITOxkJnN8cxr3-vSS83yv22lHYiUg",
      ADMIN_EMAIL_ADDRESS: "vothuong1351043@gmail.com",
    },
  },
  development: {
    host_admin: "http://127.0.0.1:8080",
    username_admin: "syadmin",
    name_admin: "Bloggo",
    phone_admin: "0364448661",
    email_admin: "duythang135104@gmail.com",
    main_folder: "src",
    secret: "BLOGGO135104",
    MONGO_URI: "mongodb://thangdz:thang18cm@localhost:27017/bloggo?authSource=admin",
    port: 27017,
    mail: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "vothuong1351043@gmail.com",
      },
    },
    mail_mailgun: {
      auth: {
        api_key: "22c6ee1fde1b7cbc0b360ef9a8c7d6da-4836d8f5-76b43d5c",
        domain: "conqueror.com",
      },
    },
    oauth2client: {
      GOOGLE_MAILER_CLIENT_ID: "707514970461-gdn1qmra429vndmn9uqgnkmlk1ehehu5.apps.googleusercontent.com",
      GOOGLE_MAILER_CLIENT_SECRET: "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",
      GOOGLE_MAILER_REFRESH_TOKEN:
        "1//04aJToMz5Gt6lCgYIARAAGAQSNwF-L9IrrUOVmazhVE7k2RHUuCB6YTxrK4XuF7jGk4uRb6ITOxkJnN8cxr3-vSS83yv22lHYiUg",
      ADMIN_EMAIL_ADDRESS: "vothuong1351043@gmail.com",
    },
  },
};
const getConfig = (env) => config[env] || config.development;

export default getConfig;
