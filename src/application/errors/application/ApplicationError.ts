import { ErrorCode } from "../ErrorCode";

export abstract class ApplicationError extends Error {
  public abstract code: ErrorCode;
  public abstract statusCode: number;

}
