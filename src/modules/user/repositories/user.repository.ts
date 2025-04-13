import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDTO, UpdateUserDTO } from "../dtos";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/modules/auth/services/auth.service";

@Injectable()
export default class UserRepository extends Repository<User> {
    constructor(
        private dataSource: DataSource,
        private authService: AuthService

    ){
        super(User, dataSource.createEntityManager());
    }

    async getAllUsers() {
        return this.find()
    }

    async getUserById(id: string) {
        return this.findOneBy({ id });
    }

    async createUser(createData: CreateUserDTO) {
        const newUser = this.create(createData);
        newUser.password = this.authService.hashPassword(newUser.password);
        return this.save(newUser);
    }

    async updateUser(id: string, updateData: UpdateUserDTO) {
        return this.update(id, updateData);
    }

    async deleteUser(id: string) {
        return this.softDelete(id);
    }
    
}