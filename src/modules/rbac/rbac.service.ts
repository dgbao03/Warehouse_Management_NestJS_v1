import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RbacService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ){}

    async getUserRoles(userId: string): Promise<number[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles']
        })

        return user ? user.roles.map(role => role.id) : [];
    }

    async getPermissionRoles(requestPermission: string): Promise<number[]> {
        const permission = await this.permissionRepository.findOne({
            where: { name: requestPermission },
            relations: ['roles']
        });

        return permission ? permission.roles.map(role => role.id) : [];
    }

}
