import { Controller } from "@application/contracts/Controller";
import { SignUpUseCase } from "@application/usecases/auth/SignUpUseCase";
import { BodySchema } from "@kernel/decorators/BodySchema";
import { Injectable } from "@kernel/decorators/Injectable";
import { SignUpBody, signUpSchema } from "./schemas/signUpSchema";

@Injectable()
@BodySchema(signUpSchema)
export class SignUpController extends Controller<unknown> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.Request<SignUpBody>
  ): Promise<Controller.Response<SignUpController.ResponseBody>> {
    const { account } = request.body;

    const result = await this.signUpUseCase.execute(account);

    return {
      statusCode: 201,
      body: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }
}

export namespace SignUpController {
  export type ResponseBody = {
    accessToken: string;
    refreshToken: string;
  }
}
