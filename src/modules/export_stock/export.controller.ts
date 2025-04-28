import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExportService } from './services/export.service';
import { CreateExportStockDTO, UpdateExportStockDTO } from './dtos';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ExportStock } from './entities/export.entity';
import { Auth } from "../../decorators/permission.decorator"
@Controller('exports')
export class ExportController {
    constructor(
        private exportService: ExportService
    ){}

    @Get()
    @Auth("get_all_exports")
    getAllExports(
        @Query('search') query: string, 
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<ExportStock>> {
        limit = limit > 5 ? 5 : limit;
        const options: IPaginationOptions = {
            page,
            limit,
            route: '/exports', 
        };
        return this.exportService.getAllExports(options, query);
    }

    @Get(":id")
    @Auth("get_export_by_id")
    getExportById(@Param('id') id: string) {
        return this.exportService.getExportById(id);
    }

    @Post()
    @Auth("create_export")
    @UsePipes(new ValidationPipe())
    createExport(@Body() createData: CreateExportStockDTO) {
        return this.exportService.createExport(createData);
    }

    // No Use in Project
    @Put(":id")
    @UsePipes(new ValidationPipe())
    updateExport(@Param('id') id: string, @Body() updateData: UpdateExportStockDTO) {
        return this.exportService.updateExport(id, updateData);
    }

    // No Use in Project
    @Delete(":id")
    deleteExport(@Param('id') id: string) {
        return this.exportService.deleteExport(id);
    }
}   
