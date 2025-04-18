import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ExportStockDetail } from "../entities/export-detail.entity";

@Injectable()
export class ExportStockDetailRepository extends Repository<ExportStockDetail> {
    constructor(
        private dataSource: DataSource
    ){
        super(ExportStockDetail, dataSource.createEntityManager());
    }
}