import { getBodySchema } from "@kernel/decorators/BodySchema";

export abstract class Controller<TBody = undefined> {
  protected abstract handle(request: Controller.Request): Promise<Controller.Response<TBody>>;

  public execute(request: Controller.Request): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(request.body);
    return this.handle({
      ...request,
      body,
    });
  }

  private validateBody(body: Controller.Request["body"]) {
    const schema = getBodySchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body);
  }
}

export namespace Controller {
  export type Request<TBody = unknown, TParams = unknown, TQueryParams = unknown, THeaders = unknown> = {
    body: TBody;
    params: TParams;
    queryParams: TQueryParams;
    headers: THeaders;
  }

  export type Response<TBody = undefined> = {
    statusCode: number;
    body?: TBody;
  }
}
