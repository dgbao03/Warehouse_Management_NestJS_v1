import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../../auth/services/auth.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { UpdateUserDTO } from '../dtos';
import UserRepository from '../repositories/user.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ){}

    async getAllUsers(){
        return User.instanceToPlain(await this.userRepository.getAllUsers());
    }

    async getUserById(id: string){
        return User.instanceToPlain(await this.userRepository.getUserById(id));
    }

    async createUser(createData: CreateUserDTO){
        return await this.userRepository.createUser(createData);
    }

    async updateUser(id: string, updateData: UpdateUserDTO){
        return await this.userRepository.updateUser(id, updateData);
    }

    async deleteUser(id: string){
        return await this.userRepository.deleteUser(id);
    }
}
