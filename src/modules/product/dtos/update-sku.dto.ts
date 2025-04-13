import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateSkuDTO {
    @IsString()
    @IsOptional()
    code: string;

    @IsNumber()
    @IsOptional()
    @Min(0) 
    price: number;


    @IsNumber()
    @IsOptional()
    @Min(0) 
    stock: number;

    @IsOptional()
    values: UpdateSkuValueDTO[];
}

export class UpdateSkuValueDTO {
    @IsNumber()
    @IsNotEmpty()
    skuId: number

    @IsNumber()
    @IsNotEmpty()
    optionId: number

    @IsNumber()
    @IsNotEmpty()
    valueId: number
}