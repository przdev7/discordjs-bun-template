import type { ErrorNames } from "@types";

export class AppError extends Error {
  public override name: ErrorNames;
  public override message: string;
  public override cause?: string;
  public isOperational: boolean;

  constructor(name: ErrorNames, message: string, isOperational: boolean, cause?: string) {
    super(message, {
      cause: cause,
    });
    this.name = name;
    this.message = message;
    this.cause = cause;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
