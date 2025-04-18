import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ExportStockDetail } from "../entities/export-detail.entity";

export class UpdateExportStockDTO {
    @IsOptional()
    @IsString()
    userId: string;

    @IsOptional()
    description: string;

    @IsOptional()
    exportStockDetails: UpdateExportStockDetailDTO[];
}

class UpdateExportStockDetailDTO {
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
