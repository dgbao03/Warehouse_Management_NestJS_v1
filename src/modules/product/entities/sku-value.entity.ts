import BaseEntity from '../../../utils/base.entity';
import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Option } from './option.entity';
import { OptionValue } from './option-values.entity';
import { ProductSku } from './product-sku.entity';


@Entity({ name: 'sku_values' })
export class SkuValue extends BaseEntity {
    @PrimaryColumn({ name: 'sku_id' })
    skuId: number;

    @PrimaryColumn({ name: 'option_id' })
    optionId: number;

    @Column({ name: 'value_id' })
    valueId: number;

    @ManyToOne(() => ProductSku, (productSku) => productSku.skuValues, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sku_id' })
    productSku: ProductSku;

    @ManyToOne(() => Option, (option) => option.skuValues, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'option_id' })
    option: Option;
    
    @ManyToOne(() => OptionValue, (value) => value.skuValues, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'value_id' })
    optionValue: OptionValue;
}