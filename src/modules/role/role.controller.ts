import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRoleDTO, UpdateRoleDTO } from './dtos';
import { RoleService } from './services/role.service';

@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) {}

    @Get()
    getAllRoles() {
        return this.roleService.getAllRoles();
    }

    @Post("/:roleId/permissions/:permissionId")
    addRolePermission(@Param('roleId') roleId: number,@Param('permissionId') permissionId: number) {
        return this.roleService.addRolePermission(roleId, permissionId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createRole(@Body() createData: CreateRoleDTO) {
        return this.roleService.createRole(createData);
    }

    @Put(":id") 
    @UsePipes(new ValidationPipe())
    updateRole(@Param('id') id: number, @Body() updateData: UpdateRoleDTO) {
        return this.roleService.updateRole(id, updateData);
    }

    @Delete(":id")
    deleteRole(@Param('id') id: number) {
        return this.roleService.deleteRole(id);
    }

    @Delete("/:roleId/permissions/:permissionId")
    removeRolePermission(@Param('roleId') roleId: number,@Param('permissionId') permissionId: number) {
        return this.roleService.removeRolePermission(roleId, permissionId);
    }
}
