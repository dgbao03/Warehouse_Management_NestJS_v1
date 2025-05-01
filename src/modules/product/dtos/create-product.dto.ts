import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNotEmpty()
    options: OptionDTO[];
}

class OptionDTO {
    @IsString()
    @IsNotEmpty()
    optionName: string;

    @IsNotEmpty()
    values: OptionValueDTO[];
}

class OptionValueDTO {
    @IsString()
    @IsNotEmpty()
    valueName: string;
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
    optionId: number;

    @IsNumber()
    @IsNotEmpty()
    valueId: number;
}

export class CreateOptionValueDTO {
    @IsNotEmpty()
    values: OptionValueDTO[];
}


