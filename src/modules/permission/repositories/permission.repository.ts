import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";

@Injectable()
export default class PermissionRepository extends Repository<Permission> {
    constructor(
        private dataSource: DataSource
    ){
        super(Permission, dataSource.createEntityManager());
    }
}