import { BadRequest } from "@application/errors/http/BadRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export function lambdaPathParameterParser(pathParameters: APIGatewayProxyEventV2["pathParameters"]) {
  try {
    if (!pathParameters) {
      return {};
    }

    return pathParameters;
  } catch {
    throw new BadRequest("Malformed Path Parameters");
  }
}
