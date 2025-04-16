import { Injectable } from '@nestjs/common';
import RoleRepository from 'src/modules/role/repositories/role.repository';
import PermissionRepository from 'src/modules/permission/repositories/permission.repository';

@Injectable()
export class RbacService {
    constructor(
        private roleRepository: RoleRepository,
        
        private permissionRepository: PermissionRepository,
    ){}

    async getUserRoles(userId: string) {
        const roles = await this.roleRepository.findBy({ users: { id: userId } });
        return roles ? roles.map(role => role.id): [];
    }

    async getPermissionRoles(requestPermission: string): Promise<number[]> {
        const permission = await this.permissionRepository.findOne({
            where: { name: requestPermission },
            relations: ['roles']
        });

        return permission ? permission.roles.map(role => role.id) : [];
    }

}
