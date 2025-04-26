import { Injectable } from '@nestjs/common';
import PermissionRepository from '../../../modules/permission/repositories/permission.repository';
import RoleRepository from '../../../modules/role/repositories/role.repository';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { defaultUsers, permissions, roles, roles_permissions } from '../data.seed';
import { Role } from '../../..//modules/role/entities/role.entity';
import { Permission } from '../../..//modules/permission/entities/permission.entity';
import { AuthService } from '../../../modules/auth/services/auth.service';

@Injectable()
export class SeedService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private permissionRepository: PermissionRepository,
        private authService: AuthService,
    ){}

    async run() {
        try {
            // Seeding Roles
            const rolesToSeedData = roles.map(role => ({ name: role.name }));
            await this.roleRepository.createQueryBuilder()
                .insert()
                .into(Role) 
                .values(rolesToSeedData)
                .orIgnore() 
                .execute();

            console.log("Seeding Roles Successful!");

            // Seeding Permissions
            await this.permissionRepository.createQueryBuilder()
                .insert()
                .into(Permission) 
                .values(permissions)
                .orIgnore() 
                .execute();

            console.log("Seeding Permissions Successful!");

            // Seeding Role-Permission
            for (const role_permission of roles_permissions) {
                const role = await this.roleRepository.findOne({ where: { name: role_permission.role }, relations: ['permissions'] });

                if (role) {
                    for (const permissionName of role_permission.permissions) {
                        const permission = await this.permissionRepository.findOneBy({ name: permissionName });
        
                        if (permission && !role.permissions.some(p => p.id === permission.id)) role.permissions.push(permission);          
                    }

                    await this.roleRepository.save(role);
                }
            }
            console.log("Seeding Roles-Permissions Successful!");
        
            // Seeding Default Admin User 
            const role = await this.roleRepository.findOneBy({ name: "Admin" });
            if (role) {
                for (const defaultUser of defaultUsers) {
                    const existedUser = await this.userRepository.findOneBy({ email: defaultUser.email });

                    if (!existedUser) {
                        defaultUser.password = this.authService.hashPassword(defaultUser.password);
                        const newDefaultUser = this.userRepository.create(defaultUser);
            
                        newDefaultUser.roles = [role];
                        await this.userRepository.save(newDefaultUser);
                    }
                }

                console.log("Seeding Default Admin Users Successful!");
            }
    
        } catch (error) {
            throw error;
        }
    }
}
