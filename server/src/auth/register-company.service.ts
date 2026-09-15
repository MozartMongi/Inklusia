import { pool } from "../db/pool.js";
import { hashPassword } from "./password.js";
import type { RegisterCompanyInput } from "./register-company.js";
import { findUserByEmail, type AuthUser } from "./users.repository.js";

export async function registerCompanyAccount(
  input: RegisterCompanyInput,
): Promise<{ user: AuthUser } | { conflict: true }> {
  const email = input.contactEmail.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    return { conflict: true };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = hashPassword(input.password);
    const userResult = await client.query<{
      id: string;
      email: string;
      role: "company";
      is_root_admin: boolean;
    }>(
      `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, 'company')
      RETURNING id, email, role, is_root_admin
      `,
      [email, passwordHash],
    );
    const userRow = userResult.rows[0];

    await client.query(
      `
      INSERT INTO company_profiles (
        user_id,
        company_name,
        address,
        industry,
        nib,
        contact_person_name,
        contact_person_position,
        contact_person_phone,
        contact_person_email,
        has_disability_employees,
        disability_workers_needed,
        needed_skills,
        disability_hire_plan,
        has_csr_or_grant
      )
      VALUES (
        $1, $2, $3, $4, '', $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      `,
      [
        userRow.id,
        input.name.trim(),
        input.address.trim(),
        input.industry.trim(),
        input.contactName.trim(),
        input.contactPosition.trim(),
        input.contactPhone.trim(),
        email,
        input.hasDisabilityEmployees === "ya",
        input.disabilityWorkersNeeded,
        input.neededSkills.trim(),
        input.hasDisabilityEmployees === "tidak"
          ? (input.disabilityHirePlan ?? "").trim()
          : "",
        input.hasCsrOrGrant === "ya",
      ],
    );

    await client.query("COMMIT");

    return {
      user: {
        id: userRow.id,
        email: userRow.email,
        role: "company",
        isRootAdmin: userRow.is_root_admin,
        status: "aktif",
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
