import BaseEntity from "../../../utils/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Option } from "./option.entity";
import { SkuValue } from "./sku-value.entity";

@Entity({ name: 'option_values' })
@Unique(['option', 'name']) 
export class OptionValue extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar',  length: 255 })
    name: string;

    @ManyToOne(() => Option, (option) => option.values)
    @JoinColumn({ name: 'option_id' }) 
    option: Option;

    @OneToMany(() => SkuValue, (skuValue) => skuValue.optionValue)
    skuValues: SkuValue[];
}