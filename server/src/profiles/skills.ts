import { SKILL_LEVELS, type SkillLevel } from "../db/job-seeker-schema.js";

export type SkillInput = {
  skillName: string;
  level: SkillLevel | "";
};

export type SkillErrors = Partial<Record<keyof SkillInput, string>>;

export function parseSkillBody(body: unknown): SkillInput {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;
  return {
    skillName: typeof record.skillName === "string" ? record.skillName : "",
    level: parseSkillLevel(record.level),
  };
}

export function parseSkillPatchBody(body: unknown): Partial<SkillInput> {
  const source = body && typeof body === "object" ? body : {};
  const record = source as Record<string, unknown>;
  const patch: Partial<SkillInput> = {};
  if ("skillName" in record) {
    patch.skillName =
      typeof record.skillName === "string" ? record.skillName : "";
  }
  if ("level" in record) {
    patch.level = parseSkillLevel(record.level);
  }
  return patch;
}

export function validateSkillInput(values: SkillInput): SkillErrors {
  const errors: SkillErrors = {};
  if (!values.skillName.trim()) {
    errors.skillName = "Nama keahlian wajib diisi.";
  }
  if (!values.level) {
    errors.level = "Tingkat kemahiran wajib dipilih.";
  }
  return errors;
}

function parseSkillLevel(value: unknown): SkillLevel | "" {
  if (
    typeof value === "string" &&
    (SKILL_LEVELS as readonly string[]).includes(value)
  ) {
    return value as SkillLevel;
  }
  return "";
}
