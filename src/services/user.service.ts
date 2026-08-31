import { db } from "../db/db.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export class UserService {
    async getUsers() {
        return await db.select().from(usersTable);
    }

    async getUserById(id: string) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async createUser(name: string, email: string) {
        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const [newUser] = await db.insert(usersTable).values({ name, email }).returning();
        return newUser;
    }

    async updateUser(id: string, name?: string, email?: string) {
        await this.getUserById(id);

        const updateData: Partial<{ name: string; email: string }> = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        if (Object.keys(updateData).length === 0) {
            return await this.getUserById(id);
        }

        const [updatedUser] = await db
            .update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, id))
            .returning();

        return updatedUser;
    }

    async deleteUserById(id: string) {
        await this.getUserById(id);

        await db.delete(usersTable).where(eq(usersTable.id, id));

        return "User deleted successfully.";
    }
}