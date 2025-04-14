import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OptionValue } from "../entities/option-values.entity";

@Injectable()
export class OptionValueRepository extends Repository<OptionValue> {
    constructor(
        private dataSource: DataSource
    ){
        super(OptionValue, dataSource.createEntityManager());
    }
}