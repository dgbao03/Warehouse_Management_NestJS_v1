import { Injectable, NotFoundException } from '@nestjs/common';
import RoleRepository from '../repositories/role.repository';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos';
import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';
import PermissionRepository from 'src/modules/permission/repositories/permission.repository';

@Injectable()
export class RoleService {
    constructor(
        private roleRepository: RoleRepository,

        private permissionRepository: PermissionRepository,
        
        private dataSource: DataSource
    ) {}

    async getAllRoles() {
        return await this.roleRepository.find({
            relations: ['permissions', 'users']
        })
    }

    async getUserRoles(userId: string) {
        const roles = await this.roleRepository.findBy({ users: { id: userId } });
        return roles ? roles.map(role => role.id): [];
    }

    async createRole(createData: CreateRoleDTO) {
        const newRole = this.roleRepository.create(createData);
        return await this.roleRepository.save(newRole);
    }

    async updateRole(id: number, updateData: UpdateRoleDTO) {
        return this.roleRepository.update(id, updateData);
    }

    async deleteRole(id: number) {
        return this.dataSource.transaction(async (entityManager) => {
            const roleRepo = entityManager.getRepository(Role);

            await roleRepo
                .createQueryBuilder()
                .delete()
                .from('roles_permissions')
                .where('role_id = :id', { id })
                .execute();
                    
            await roleRepo.softDelete(id);
        })
    }
    
    async addRolePermission(roleId: number, permissionId: number) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'permissions')
            .of(role)
            .add(permission);
    }

    async removeRolePermission(roleId: number, permissionId: number){
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });

        if (!role || !permission) throw new NotFoundException("Role or Permission not found!");

        return await this.roleRepository
            .createQueryBuilder()
            .relation(Role, 'permissions')
            .of(role)
            .remove(permission);
    }
}
