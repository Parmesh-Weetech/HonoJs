import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async getUsers() {
        const users = await this.userRepository.find();
    
        if(users.length === 0) {
            return [];
        }

        return users;
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if(!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async createUser(name: string, email: string) {
        const existingUser = await this.userRepository.findOne({ where: { email } });

        if(existingUser) {
            throw new Error("User with this email already exists");
        }

        const user = this.userRepository.create({ name, email });

        await this.userRepository.save(user);

        return await this.getUserById(user.id);
    }
}