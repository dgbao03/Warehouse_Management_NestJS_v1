import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { Auth } from '../..//decorators/decorators.decorator';

@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ){}

    @Get()
    @Auth("get_all_permissions")
    getAllPermissions(){
        return this.permissionService.getAllPermissions();
    }
}
