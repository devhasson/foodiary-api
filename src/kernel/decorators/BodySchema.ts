import { ZodMiniType } from "zod/v4-mini";

const BODY_SCHEMA_METADATA_KEY = "custom:body-schema";

export function BodySchema(schema: ZodMiniType): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(BODY_SCHEMA_METADATA_KEY, schema, target);
  }
}

export function getBodySchema(target: any): ZodMiniType | undefined {
  return Reflect.getMetadata(BODY_SCHEMA_METADATA_KEY, target.constructor);
}
