import { isUuid } from "../db/ids.js";
import { pool } from "../db/pool.js";
import {
  mapUserRowToAuthUser,
  type AuthUser,
  type UserRole,
  type UserRow,
  USER_ROLES,
} from "../db/users-schema.js";

export type { AuthUser, UserRole };
export { USER_ROLES };

type UserAuthRow = Pick<
  UserRow,
  | "id"
  | "email"
  | "role"
  | "is_root_admin"
  | "password_hash"
  | "full_name"
  | "status"
>;

export async function findUserById(userId: string): Promise<AuthUser | null> {
  if (!isUuid(userId)) {
    return null;
  }

  const { rows } = await pool.query<
    Pick<
      UserRow,
      "id" | "email" | "role" | "is_root_admin" | "full_name" | "status"
    >
  >(
    `
    SELECT id, email, role, is_root_admin, full_name, status
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [userId],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return mapUserRowToAuthUser({
    ...row,
    password_hash: "",
    created_at: new Date(0),
    updated_at: new Date(0),
  });
}

export async function findUserByEmail(
  email: string,
): Promise<(AuthUser & { passwordHash: string }) | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const { rows } = await pool.query<UserAuthRow>(
    `
    SELECT id, email, role, is_root_admin, password_hash, full_name, status
    FROM users
    WHERE lower(email) = $1
    LIMIT 1
    `,
    [normalized],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  const auth = mapUserRowToAuthUser({
    ...row,
    created_at: new Date(0),
    updated_at: new Date(0),
  });
  if (!auth) {
    return null;
  }

  return { ...auth, passwordHash: row.password_hash };
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  role: UserRole;
  isRootAdmin?: boolean;
}): Promise<AuthUser> {
  const { rows } = await pool.query<
    Pick<
      UserRow,
      "id" | "email" | "role" | "is_root_admin" | "full_name" | "status"
    >
  >(
    `
    INSERT INTO users (email, password_hash, role, is_root_admin, full_name, status)
    VALUES ($1, $2, $3, $4, '', 'aktif')
    RETURNING id, email, role, is_root_admin, full_name, status
    `,
    [
      input.email.trim().toLowerCase(),
      input.passwordHash,
      input.role,
      input.isRootAdmin ?? false,
    ],
  );

  const row = rows[0];
  const auth = mapUserRowToAuthUser({
    ...row,
    password_hash: "",
    created_at: new Date(0),
    updated_at: new Date(0),
  });
  if (!auth) {
    throw new Error("Gagal membuat akun pengguna.");
  }
  return auth;
}

export async function updateUserPasswordHash(
  userId: string,
  passwordHash: string,
): Promise<boolean> {
  if (!isUuid(userId)) {
    return false;
  }

  const { rowCount } = await pool.query(
    `
    UPDATE users
    SET password_hash = $2, updated_at = NOW()
    WHERE id = $1
    `,
    [userId, passwordHash],
  );

  return (rowCount ?? 0) > 0;
}
