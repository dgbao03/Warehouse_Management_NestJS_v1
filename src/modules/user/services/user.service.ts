import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/services/auth.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { UpdateUserDTO } from '../dtos';
import UserRepository from '../repositories/user.repository';
import { Role } from 'src/modules/role/entities/role.entity';
@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService
    ){}

    async getAllUsers(){
        return User.instanceToPlain(await this.userRepository.find());
    }

    async getUserById(id: string){
        return User.instanceToPlain(await this.userRepository.findOneBy({ id }));
    }

    async createUser(createData: CreateUserDTO){
        const newUser = this.userRepository.create(createData);
        newUser.password = this.authService.hashPassword(newUser.password);
        return await this.userRepository.save(newUser);
    }

    async updateUser(id: string, updateData: UpdateUserDTO){
        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string){
        return await this.userRepository.softDelete(id);
    }
}
