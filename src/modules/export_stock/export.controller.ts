import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExportService } from './services/export.service';
import { CreateExportStockDTO, UpdateExportStockDTO } from './dtos';

@Controller('exports')
export class ExportController {
    constructor(
        private exportService: ExportService
    ){}

    @Get()
    getAllExports() {
        return this.exportService.getAllExports();
    }

    @Get(":id")
    getExportById(@Param('id') id: string) {
        return this.exportService.getExportById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createExport(@Body() createData: CreateExportStockDTO) {
        return this.exportService.createExport(createData);
    }

    @Put(":id")
    @UsePipes(new ValidationPipe())
    updateExport(@Param('id') id: string, @Body() updateData: UpdateExportStockDTO) {
        return this.exportService.updateExport(id, updateData);
    }

    @Delete(":id")
    deleteExport(@Param('id') id: string) {
        return this.exportService.deleteExport(id);
    }
}   
