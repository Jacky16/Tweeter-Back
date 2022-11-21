import environment from "./loadEnvironments.js";
import app from "./app.js";
import startServer from "./server/index.js";

const { port } = environment;

await startServer(Number(port), app);
