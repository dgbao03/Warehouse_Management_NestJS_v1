import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private authService: AuthService
    ){}

    async getAllUsers(){
        return User.instanceToPlain(await this.userRepository.find());
    }

    async getUserById(id: string){
        const user = await this.userRepository.findOne({ where: { id: id }});

        if(!user) throw new NotFoundException("User not found! Please try again!");

        return User.instanceToPlain(user);
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
        return await this.userRepository.delete(id);
    }
}
