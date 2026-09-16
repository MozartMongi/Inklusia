import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import { hashPassword } from "../auth/password.js";

export type AdminAccountKind = "root" | "admin";
export type AdminAccountStatus = "aktif" | "nonaktif";

export type AdminAccount = {
  id: string;
  fullName: string;
  email: string;
  kind: AdminAccountKind;
  status: AdminAccountStatus;
  createdAt: string;
  updatedAt: string;
};

type AdminAccountRow = {
  id: string;
  email: string;
  full_name: string;
  is_root_admin: boolean;
  status: AdminAccountStatus;
  created_at: Date;
  updated_at: Date;
};

function mapAdminAccount(row: AdminAccountRow): AdminAccount {
  return {
    id: row.id,
    fullName: row.full_name || row.email,
    email: row.email,
    kind: row.is_root_admin ? "root" : "admin",
    status: row.status === "nonaktif" ? "nonaktif" : "aktif",
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const ADMIN_SELECT = `
  SELECT id, email, full_name, is_root_admin, status, created_at, updated_at
  FROM users
  WHERE role = 'admin'
`;

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const { rows } = await pool.query<AdminAccountRow>(
    `
    ${ADMIN_SELECT}
    ORDER BY is_root_admin DESC, lower(full_name) ASC, lower(email) ASC
    `,
  );
  return rows.map(mapAdminAccount);
}

export async function findAdminAccountById(
  id: string,
): Promise<AdminAccount | null> {
  if (!isUuid(id)) {
    return null;
  }

  const { rows } = await pool.query<AdminAccountRow>(
    `
    ${ADMIN_SELECT}
    AND id = $1
    LIMIT 1
    `,
    [id],
  );

  const row = rows[0];
  return row ? mapAdminAccount(row) : null;
}

export async function createAdminAccount(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ data: AdminAccount } | { error: string }> {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  const existing = await pool.query(
    `SELECT id FROM users WHERE lower(email) = $1 LIMIT 1`,
    [email],
  );
  if (existing.rows[0]) {
    return { error: "Email admin sudah terdaftar." };
  }

  const { rows } = await pool.query<AdminAccountRow>(
    `
    INSERT INTO users (
      email, password_hash, role, is_root_admin, full_name, status
    )
    VALUES ($1, $2, 'admin', FALSE, $3, 'aktif')
    RETURNING id, email, full_name, is_root_admin, status, created_at, updated_at
    `,
    [email, hashPassword(input.password), fullName],
  );

  const row = rows[0];
  if (!row) {
    return { error: "Gagal membuat akun admin." };
  }

  return { data: mapAdminAccount(row) };
}

export async function updateAdminAccount(
  id: string,
  input: { fullName: string; email: string; password?: string },
): Promise<{ data: AdminAccount } | { error: string } | null> {
  if (!isUuid(id)) {
    return null;
  }

  const current = await findAdminAccountById(id);
  if (!current) {
    return null;
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (current.kind === "root" && email !== current.email) {
    return { error: "Email root admin tidak dapat diubah." };
  }

  const conflict = await pool.query(
    `
    SELECT id FROM users
    WHERE lower(email) = $1 AND id <> $2
    LIMIT 1
    `,
    [email, id],
  );
  if (conflict.rows[0]) {
    return { error: "Email admin sudah terdaftar." };
  }

  const password = input.password?.trim();
  if (password) {
    await pool.query(
      `
      UPDATE users
      SET
        full_name = $2,
        email = $3,
        password_hash = $4,
        updated_at = NOW()
      WHERE id = $1 AND role = 'admin'
      `,
      [id, fullName, email, hashPassword(password)],
    );
  } else {
    await pool.query(
      `
      UPDATE users
      SET full_name = $2, email = $3, updated_at = NOW()
      WHERE id = $1 AND role = 'admin'
      `,
      [id, fullName, email],
    );
  }

  return { data: (await findAdminAccountById(id))! };
}

export async function setAdminAccountStatus(
  id: string,
  status: AdminAccountStatus,
): Promise<{ data: AdminAccount } | { error: string } | null> {
  if (!isUuid(id)) {
    return null;
  }

  const current = await findAdminAccountById(id);
  if (!current) {
    return null;
  }
  if (current.kind === "root") {
    return { error: "Akun root admin tidak dapat dinonaktifkan." };
  }

  await pool.query(
    `
    UPDATE users
    SET status = $2, updated_at = NOW()
    WHERE id = $1 AND role = 'admin'
    `,
    [id, status],
  );

  return { data: (await findAdminAccountById(id))! };
}
