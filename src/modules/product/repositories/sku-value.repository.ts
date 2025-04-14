import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SkuValue } from "../entities/sku-value.entity";

@Injectable()
export class SkuValueRepository extends Repository<SkuValue> {
    constructor(
        private dataSource: DataSource
    ){
        super(SkuValue, dataSource.createEntityManager());
    }
}