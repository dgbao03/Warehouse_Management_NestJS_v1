import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { Auth } from 'src/decorators/decorators.decorator';

@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ){}

    @Get()
    getAllPermissions(){
        return this.permissionService.getAllPermissions();
    }
}
