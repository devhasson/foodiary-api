import { ErrorCode } from "../ErrorCode";
import { ApplicationError } from "./ApplicationError";

export class EmailAlreadyInUse extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode: number;

  public constructor() {
    super();

    this.message = "Email already in use";
    this.name = "EmailAlreadyInUse";
    this.code = ErrorCode.EMAIL_ALREADY_IN_USE;
    this.statusCode = 409;
  }
}
