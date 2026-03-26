import Ajv from "ajv";
import addFormats from "ajv-formats";
import { cvSchema, type CvData } from "./schema.js";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(cvSchema);

export function validateCv(data: unknown): { valid: true; data: CvData } | { valid: false; errors: string[] } {
  if (validate(data)) {
    return { valid: true, data: data as CvData };
  }
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath || "/"}: ${e.message}`
  );
  return { valid: false, errors };
}
