import type { JSONSchemaType } from "ajv";

export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvEducation {
  institution: string;
  degree: string;
  period: string;
  grade?: string;
  focus?: string[];
  details?: string[];
}

export interface CvExperience {
  title: string;
  company: string;
  period: string;
  tasks?: string[];
}

export interface CvPersonal {
  name: string;
  address: string;
  email: string;
  phone: string;
  birthdate: string;
  birthplace?: string;
  photo?: string;
}

export interface CvSkills {
  languages: CvLanguage[];
  technical?: string[];
  soft?: string[];
}

export interface CvData {
  personal: CvPersonal;
  education: CvEducation[];
  skills: CvSkills;
  experience?: CvExperience[];
  interests?: string[];
}

export const cvSchema: JSONSchemaType<CvData> = {
  type: "object",
  required: ["personal", "education", "skills"],
  additionalProperties: false,
  properties: {
    personal: {
      type: "object",
      required: ["name", "address", "email", "phone", "birthdate"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 1 },
        address: { type: "string", minLength: 1 },
        email: { type: "string", format: "email" },
        phone: { type: "string", minLength: 1 },
        birthdate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        birthplace: { type: "string", nullable: true },
        photo: { type: "string", nullable: true },
      },
    },
    education: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["institution", "degree", "period"],
        additionalProperties: false,
        properties: {
          institution: { type: "string", minLength: 1 },
          degree: { type: "string", minLength: 1 },
          period: { type: "string", minLength: 1 },
          grade: { type: "string", nullable: true },
          focus: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
          details: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
        },
      },
    },
    skills: {
      type: "object",
      required: ["languages"],
      additionalProperties: false,
      properties: {
        languages: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["name", "level"],
            additionalProperties: false,
            properties: {
              name: { type: "string", minLength: 1 },
              level: { type: "string", minLength: 1 },
            },
          },
        },
        technical: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
        soft: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
      },
    },
    experience: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        required: ["title", "company", "period"],
        additionalProperties: false,
        properties: {
          title: { type: "string", minLength: 1 },
          company: { type: "string", minLength: 1 },
          period: { type: "string", minLength: 1 },
          tasks: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
        },
      },
    },
    interests: {
      type: "array",
      nullable: true,
      items: { type: "string" },
    },
  },
};
