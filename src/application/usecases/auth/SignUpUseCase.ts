import { Account } from "@application/entities/Account";
import { EmailAlreadyInUse } from "@application/errors/application/EmailAlreadyInUse";
import { AccountRepository } from "@infra/database/dynamo/repositories/AccountRepository";
import { AuthGateway } from "@infra/gateways/AuthGateway";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository
  ) { }

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const existingAccount = await this.accountRepository.findByEmail(input.email);

    if (existingAccount) {
      throw new EmailAlreadyInUse();
    }

    const { externalId } = await this.authGateway.signUp(input);

    const account = new Account({
      email: input.email,
      externalId,
    })

    await this.accountRepository.create(account);

    const { accessToken, refreshToken } = await this.authGateway.signIn(input);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
