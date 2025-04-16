import { Injectable } from '@nestjs/common';
import PermissionRepository from '../repositories/permission.repository';

@Injectable()
export class PermissionService {
    constructor(
        private permissionRepository: PermissionRepository
    ){}

    async getAllPermissions() {
        return await this.permissionRepository.find();
    }
}
