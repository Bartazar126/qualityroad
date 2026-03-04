import { createHash } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_USER  = process.env.ADMIN_USERNAME ?? "Admin";
const ADMIN_PASS  = process.env.ADMIN_PASSWORD ?? "Qualityroad2026";

/** Derived token — changes only if credentials change */
export const ADMIN_COOKIE_NAME  = "qr_admin_session";
export const ADMIN_COOKIE_VALUE = createHash("sha256")
  .update(`${ADMIN_USER}:${ADMIN_PASS}:qualityroad-intact-kft`)
  .digest("hex");

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === ADMIN_COOKIE_VALUE;
}
