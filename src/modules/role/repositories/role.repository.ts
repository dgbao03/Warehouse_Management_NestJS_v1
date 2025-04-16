import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Role } from "../entities/role.entity";

@Injectable()
export default class RoleRepository extends Repository<Role> {
    constructor(
        private dataSource: DataSource
    ){
        super(Role, dataSource.createEntityManager());
    }
}