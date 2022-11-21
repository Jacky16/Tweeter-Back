import environment from "../loadEnvironments.js";
import chalk from "chalk";
import createDebug from "debug";
import mongoose from "mongoose";

const debug = createDebug(`${environment.debug}:database:root`);

const connectDatabase = async (url: string) => {
  await mongoose.connect(url);

  debug(chalk.green.bold("Connected to database"));

  mongoose.set("debug", environment.mongoDbDebug);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ret;
    },
  });
};

export default connectDatabase;
