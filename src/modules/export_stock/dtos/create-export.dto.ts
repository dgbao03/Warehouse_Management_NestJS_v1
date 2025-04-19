import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateExportStockDTO {
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    exportStockDetails: ExportStockDetailDTO[];
}

export class ExportStockDetailDTO {
    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) 
    skuId: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value)) 
    exportQuantity: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value)) 
    exportPrice: number;
}

