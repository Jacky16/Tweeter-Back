import environment from "../loadEnvironments.js";
import createDebug from "debug";
import chalk from "chalk";
import type { Express } from "express";

const debug = createDebug(`${environment.debug}server`);

const startServer = async (port: number, app: Express) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green.bold(`Listening on http://localhost:${port}`));
      resolve(server);
    });

    server.on("error", (error: Error) => {
      debug(chalk.red("Error connecting to the server"));
      reject(error);
    });
  });

export default startServer;
