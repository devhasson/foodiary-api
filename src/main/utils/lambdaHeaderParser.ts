import { BadRequest } from "@application/errors/http/BadRequest";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export function lambdaHeaderParser(headers: APIGatewayProxyEventV2["headers"]) {
  try {
    if (!headers) {
      return {};
    }

    return headers;
  } catch {
    throw new BadRequest("Malformed Headers");
  }
}
