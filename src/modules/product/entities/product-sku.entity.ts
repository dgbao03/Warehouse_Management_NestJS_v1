import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Option } from "./option.entity";
import BaseEntity from "../../../utils/base.entity";
import { Product } from "./product.entity";
import { SkuValue } from "./sku-value.entity";
import { ExportStockDetail } from "../../export_stock/entities/export-detail.entity";

@Entity({ name: 'product_skus' })
export class ProductSku extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar',  length: 255 })
    code: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ default: 0 })
    stock: number;

    @ManyToOne(() => Product, (product) => product.productSkus)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @OneToMany(() => SkuValue, (skuValue) => skuValue.productSku)
    skuValues: SkuValue[];

    @OneToMany(() => ExportStockDetail, exportStockDetail => exportStockDetail.productSku)
    exportStockDetails: ExportStockDetail[];
}
