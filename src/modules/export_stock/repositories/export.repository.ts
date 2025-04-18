import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ExportStock } from "../entities/export.entity";

@Injectable()
export class ExportStockRepository extends Repository<ExportStock> {
    constructor(
        private dataSource: DataSource
    ){
        super(ExportStock, dataSource.createEntityManager());
    }
}