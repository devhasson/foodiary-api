import { Controller } from "@application/contracts/Controller";
import { BodySchema } from "@kernel/decorators/BodySchema";
import { Injectable } from "@kernel/decorators/Injectable";
import { SignInBody, signInSchema } from "./schemas/signInSchema";
import { SignInUseCase } from "@application/usecases/auth/SignInUseCase";

@Injectable()
@BodySchema(signInSchema)
export class SignInController extends Controller<unknown> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.Request<SignInBody>
  ): Promise<Controller.Response<SignInController.ResponseBody>> {
    const { email, password } = request.body;

    const { accessToken, refreshToken } = await this.signInUseCase.execute({ email, password });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignInController {
  export type ResponseBody = {
    accessToken: string;
    refreshToken: string;
  }
}
