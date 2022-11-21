/* eslint-disable no-implicit-coercion */
import environment from "./loadEnvironments.js";
import app from "./app.js";
import startServer from "./server/index.js";
import connectDatabase from "./database/index.js";

const { port } = environment;

await startServer(+port, app);
await connectDatabase(environment.mongoDbUrl);
