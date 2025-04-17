import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../dtos';
import UserRepository from '../repositories/user.repository';
import { RoleService } from 'src/modules/role/services/role.service';
import { SignInPayload } from 'src/modules/user/dtos/sign-in.dto';
import { JwtService } from 'src/modules/jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/services/auth.service';
import RoleRepository from 'src/modules/role/repositories/role.repository';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,

        private roleRepository: RoleRepository,

        private authService: AuthService,

        private roleService: RoleService,

        private jwtService: JwtService,

        private configService: ConfigService
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

    async addUserRole(roleId: number, userId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!role || !user) throw new NotFoundException("Role or User not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'users')
            .of(role)
            .add(user);
    }

    async removeUserRole(roleId: number, userId: string) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!role || !user) throw new NotFoundException("Role or Usser not found!");

        return await this.userRepository
            .createQueryBuilder()
            .relation(User, 'roles')
            .of(user)
            .remove(role);
    }

    async signIn(payload: SignInPayload) {
        const user = await this.userRepository.findOne({ where: { email: payload.email} })
        if (!user) throw new NotFoundException("Email not exist! Please try again!");

        const checkPassword = await this.authService.comparePassword(payload.password, user.password);
        if(!checkPassword) throw new BadRequestException("Password is incorrect! Please try again!");

        const userRoles = await this.roleService.getUserRoles(user.id);

        
        const accessToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("ACCESS_SECRET_TOKEN"),

            {
                expiresIn: "15m"
            }
        )

        const refreshToken = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                roles: userRoles
            },

            this.configService.getOrThrow("REFRESH_SECRET_TOKEN"),

            {
                expiresIn: "1h"
            }
        )
        
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
}
