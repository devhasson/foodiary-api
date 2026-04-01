import { BadRequest } from "@application/errors/http/BadRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export function lambdaQueryStringParameterParser(queryStringParameters: APIGatewayProxyEventV2["queryStringParameters"]) {
  try {
    if (!queryStringParameters) {
      return {};
    }

    return queryStringParameters;
  } catch {
    throw new BadRequest("Malformed Query String Parameters");
  }
}
