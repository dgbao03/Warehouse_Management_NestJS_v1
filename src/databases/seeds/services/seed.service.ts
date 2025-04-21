import { Injectable } from '@nestjs/common';
import PermissionRepository from '../../../modules/permission/repositories/permission.repository';
import RoleRepository from '../../../modules/role/repositories/role.repository';
import UserRepository from '../../../modules/user/repositories/user.repository';
import { defaultUsers, permissions, roles } from '../data.seed';
import { Role } from '../../..//modules/role/entities/role.entity';
import { Permission } from '../../..//modules/permission/entities/permission.entity';
import { AuthService } from '../../..//modules/auth/services/auth.service';

@Injectable()
export class SeedService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private permissionRepository: PermissionRepository,
        private authService: AuthService,
    ){}

    async run() {
        const rolesToSeedData = roles.map(role => ({ name: role.name }));

        await this.roleRepository.createQueryBuilder()
            .insert()
            .into(Role) 
            .values(rolesToSeedData)
            .orIgnore() 
            .execute();

        const newPermissions = await this.permissionRepository.createQueryBuilder()
            .insert()
            .into(Permission) 
            .values(permissions)
            .orIgnore() 
            .execute();
    
        const allPermissions = await this.permissionRepository.find();

        const adminRole = await this.roleRepository.findOne({
            where: { name: "Admin" },
            relations: ["permissions"] 
        })

        if(!adminRole) return "Seeding Failed! Cannot find Admin Role!";

        if (adminRole) {
            const existingPermissionIds = new Set(adminRole.permissions.map(p => p.id));
            const permissionsToAdd = allPermissions.filter(p => !existingPermissionIds.has(p.id));
            
            if (permissionsToAdd.length > 0) {
                adminRole.permissions = [...adminRole.permissions, ...permissionsToAdd];
                await this.roleRepository.save(adminRole);
            } 
        }

        for (const defaultUser of defaultUsers){
            const account = await this.userRepository.findOneBy({ email: defaultUser.email });

            if (!account){
                defaultUser.password = this.authService.hashPassword(defaultUser.password)
                const newDefaultAccount = this.userRepository.create(defaultUser);

                newDefaultAccount.roles = [adminRole];
                await this.userRepository.save(newDefaultAccount);
            }
        }
    }
}
