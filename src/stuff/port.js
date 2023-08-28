import argv from "./argv.js";

const port = parseInt(argv.port || process.env.PORT || "3003", 10);
export default port;
