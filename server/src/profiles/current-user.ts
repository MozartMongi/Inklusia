import type { Request } from "express";
import { authUser } from "../auth/middleware.js";

export function currentUserId(req: Request): string {
  return authUser(req).id;
}
