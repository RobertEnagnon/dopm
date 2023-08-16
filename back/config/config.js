module.exports = {
    DATABASE_URL: "mysql://root@localhost:3306/dopm?schema=public",
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIl_FROM: process.env.MAIl_FROM,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    CALLBACK_URL: process.env.CALLBACK_URL,
    LOGOUT_CALLBACK_URL: process.env.LOGOUT_CALLBACK_URL,
    LOGIN_REDIRECT_URL: process.env.LOGIN_REDIRECT_URL,
    LOGOUT_REDIRECT_URL: process.env.LOGOUT_REDIRECT_URL,
    ERROR_REDIRECT_URL: process.env.ERROR_REDIRECT_URL
};