import bcrypt from "bcryptjs";

const SALT_ROUNDS = process.env.SALT_ROUNDS;

if (!SALT_ROUNDS) {
    throw new Error("SALT_ROUNDS is not defined");
}

export async function hashPassword(
    password: string,
): Promise<string> {
    return bcrypt.hash(password, parseInt(SALT_ROUNDS!));
}

export async function verifyPassword(
    password: string,
    passwordHash: string,
): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}