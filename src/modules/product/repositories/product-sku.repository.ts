import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { ProductSku } from "../entities/product-sku.entity";

@Injectable()
export class ProductSkuRepository extends Repository<ProductSku> {
    constructor(
        private dataSource: DataSource
    ){
        super(ProductSku, dataSource.createEntityManager());
    }
}