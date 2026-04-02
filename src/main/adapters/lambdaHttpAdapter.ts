import { Controller } from "@application/contracts/Controller";
import { ApplicationError } from "@application/errors/application/ApplicationError";
import { ErrorCode } from "@application/errors/ErrorCode";
import { HttpError } from "@application/errors/http/HttpError";
import { lambdaBodyParser } from "@main/utils/lambdaBodyParser";
import { lambdaErrorResponse } from "@main/utils/lambdaErrorResponse";
import { lambdaHeaderParser } from "@main/utils/lambdaHeaderParser";
import { lambdaPathParameterParser } from "@main/utils/lambdaPathParameterParser";
import { lambdaQueryStringParameterParser } from "@main/utils/lambdaQueryStringParameterParser";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { z } from "zod/v4-mini";

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const queryParams = lambdaQueryStringParameterParser(event.queryStringParameters);
      const headers = lambdaHeaderParser(event.headers);
      const params = lambdaPathParameterParser(event.pathParameters);
      const body = lambdaBodyParser(event.body);

      const response = await controller.execute({
        body,
        queryParams,
        headers,
        params,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof z.core.$ZodError) {
        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION_ERROR,
          message: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }))

        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          statusCode: error.statusCode,
          code: error.code,
          message: error.message,
        });
      }

      // eslint-disable-next-line no-console
      console.error(error);

      return lambdaErrorResponse({
        statusCode: 500,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "An unknown error occurred",
      });
    }
  };
}
