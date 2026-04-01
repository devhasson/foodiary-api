import { ErrorCode } from "../ErrorCode";
import { HttpError } from "./HttpError";

export class BadRequest extends HttpError {
  public override statusCode: number;
  public override code: ErrorCode

  public constructor(message: any, code?: ErrorCode) {
    super();
    this.name = "BadRequest";
    this.statusCode = 400;
    this.code = code ?? ErrorCode.BAD_REQUEST;
    this.message = message ?? "Bad Request";
  }
}
