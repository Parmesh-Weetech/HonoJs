import crypto from "node:crypto";

export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
}