import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsNotEmpty()
    options: OptionDTO[];
}

class OptionDTO {
    @IsString()
    @IsNotEmpty()
    option_name: string;

    @IsNotEmpty()
    values: OptionValueDTO[];
}

class OptionValueDTO {
    @IsString()
    @IsNotEmpty()
    value_name: string;
}

export class BaseSkuDTO {
    @IsNotEmpty()
    skus: SkuDTO[];
}

class SkuDTO {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsNotEmpty()
    skuValues: SkuValueDTO[];

}

class SkuValueDTO {
    @IsNumber()
    @IsNotEmpty()
    option_id: number;

    @IsNumber()
    @IsNotEmpty()
    value_id: number;
}

export class CreateOptionValueDTO {
    @IsNotEmpty()
    values: OptionValueDTO[];
}


