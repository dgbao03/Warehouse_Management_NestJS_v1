import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UpdateUserDTO } from '../dtos';
import UserRepository from '../repositories/user.repository';
import { RoleService } from '../../role/services/role.service';
import { SignInPayload } from '../dtos/sign-in.dto';
import { JwtService } from '../../jwt/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/services/auth.service';
import RoleRepository from '../../role/repositories/role.repository';
import { Role } from '../../role/entities/role.entity';
import { DataSource } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private authService: AuthService,
        private roleService: RoleService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private dataSource: DataSource
    ){}

    async getAllUsers(options: IPaginationOptions, query?: string): Promise<Pagination<User>> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (query) queryBuilder.where('LOWER(user.fullname) LIKE :query', { query: `%${query.toLowerCase()}%` });

        return paginate<User>(queryBuilder, options);
    }

    async getUserById(id: string){
        return User.instanceToPlain(await this.userRepository.findOneBy({ id }));
    }

    async createUser(createData: CreateUserDTO){
        const existedEmail = await this.userRepository.findOneBy({ email: createData.email });
        if (existedEmail) throw new BadRequestException("Email already exists! Please try again!");

        const newUser = this.userRepository.create(createData);
        newUser.password = this.authService.hashPassword(newUser.password);

        const staffRole = await this.roleRepository.findOne({
            where: { name: 'Staff' },
        });

        if(!staffRole) throw new InternalServerErrorException("Cannot attach default role (Staff) to User! Please try again!");

        newUser.roles = [staffRole];
        return await this.userRepository.save(newUser);
    }

    async updateUser(id: string, updateData: UpdateUserDTO){
        if (updateData.email) {
            const existedEmail = await this.userRepository.findOneBy({ email: updateData.email });
            if (existedEmail) throw new BadRequestException("Email already exists! Please try again!");
        }

        return await this.userRepository.update(id, updateData);
    }

    async deleteUser(id: string){
        return this.dataSource.transaction(async (entityManager) => {
            const userRepo = entityManager.getRepository(User);

            await userRepo
                .createQueryBuilder()
                .delete()
                .from('users_roles')
                .where('user_id = :id', { id })
                .execute();
                    
            await userRepo.softDelete(id);
        })
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
