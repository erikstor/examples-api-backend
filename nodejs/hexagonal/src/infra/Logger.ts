import { Logger as LoggerPower } from '@aws-lambda-powertools/logger';
import { Context } from "aws-lambda";

class Logger {
  private static instance: LoggerPower;

  public static getInstance(): LoggerPower {
    return Logger.instance;
  }
  public static setInstance(context: Context) {
    Logger.instance = new LoggerPower({ serviceName: context.functionName });
    Logger.getInstance().addContext(context)
  }
}

export default Logger;
