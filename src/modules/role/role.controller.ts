import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRoleDTO, UpdateRoleDTO } from './dtos';
import { RoleService } from './services/role.service';
import { Auth } from '../../decorators/permission.decorator';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) {}

    @Get()
    @Auth("get_all_roles")
    getAllRoles() {
        return this.roleService.getAllRoles();
    }

    @Auth("create_role_permission")
    @Post("/:roleId/permissions/:permissionId")
    addRolePermission(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number) {
        return this.roleService.addRolePermission(roleId, permissionId);
    }

    @Post()
    @Auth("create_role")
    @UsePipes(new ValidationPipe())
    createRole(@Body() createData: CreateRoleDTO) {
        return this.roleService.createRole(createData);
    }

    @Put(":id") 
    @Auth("update_role")
    @UsePipes(new ValidationPipe())
    updateRole(@Param('id') id: number, @Body() updateData: UpdateRoleDTO) {
        return this.roleService.updateRole(id, updateData);
    }

    @Delete(":id")
    @Auth("delete_role")
    deleteRole(@Param('id') id: number) {
        return this.roleService.deleteRole(id);
    }

    @Delete("/:roleId/permissions/:permissionId")
    @Auth("delete_role_permission")
    removeRolePermission(@Param('roleId') roleId: number,@Param('permissionId') permissionId: number) {
        return this.roleService.removeRolePermission(roleId, permissionId);
    }
}
