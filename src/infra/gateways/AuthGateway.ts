import { AuthFlowType, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognitoClient";
import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/AppConfig";
import { createHmac } from "node:crypto";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) { }

  async signUp(params: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const { email, password } = params;

    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      SecretHash: this.generateSecretHash(email),
      Username: email,
      Password: password,
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot sign up user: ${email}`);
    }

    return { externalId };
  }

  async signIn(params: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const { email, password } = params;

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.appConfig.auth.cognito.client.id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.generateSecretHash(email),
      },
    })

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
      throw new Error(`Cannot sign in user: ${email}`);
    }

    const { AccessToken, RefreshToken } = AuthenticationResult;

    return {
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    };
  }

  private generateSecretHash(email: string): string {
    const { id, secret } = this.appConfig.auth.cognito.client;

    return createHmac('SHA256', secret)
      .update(`${email}${id}`)
      .digest('base64');
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
  }

  export type SignUpResult = {
    externalId: string;
  }

  export type SignInParams = {
    email: string;
    password: string;
  }

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  }
}
