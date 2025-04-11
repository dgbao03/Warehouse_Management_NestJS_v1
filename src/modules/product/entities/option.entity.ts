import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import BaseEntity from "../../../utils/base.entity";
import { OptionValue } from "./option-values.entity";
import { SkuValue } from "./sku-value.entity";

@Entity({ name: 'options' })
@Unique(['product', 'name']) 
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar',  length: 255})
    name: string;

    @ManyToOne(() => Product, (product) => product.options, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' }) 
    product: Product;

    @OneToMany(() => OptionValue, (value) => value.option)
    values: OptionValue[];

    @OneToMany(() => SkuValue, (skuValue) => skuValue.option)
    skuValues: SkuValue[];
}