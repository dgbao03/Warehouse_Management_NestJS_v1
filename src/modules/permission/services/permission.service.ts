import { Injectable } from '@nestjs/common';
import PermissionRepository from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
    constructor(
        private permissionRepository: PermissionRepository
    ){}

    async getAllPermissions() {
        return await this.permissionRepository.find({
            relations: ['roles']
        });
    }

    async getPermissionRoles(requestPermission: string): Promise<number[]> {
        const permission = await this.permissionRepository.findOne({
            where: { name: requestPermission },
            relations: ['roles']
        });

        return permission ? permission.roles.map(role => role.id) : [];
    }
}
