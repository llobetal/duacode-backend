import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DuacodersService } from './duacoders.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DuacoderEntity } from './entities/duacoder.entity/duacoder.entity';

@ApiTags('Duacoders')
@ApiBearerAuth()
@Controller('duacoders')
@UseGuards(JwtAuthGuard)
export class DuacodersController {
  constructor(private readonly duacodersService: DuacodersService) {}

  @Post()
  async create(
    @Body() createDuacoderDto: Partial<DuacoderEntity>,
  ): Promise<DuacoderEntity> {
    return this.duacodersService.create(createDuacoderDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('departamento') departamento?: string,
  ): Promise<DuacoderEntity[]> {
    const filters = departamento ? { departamento } : undefined;
    return this.duacodersService.findAll(Number(page), Number(limit), filters);
  }

  @Get(':nif')
  async findOne(@Param('nif') nif: string): Promise<DuacoderEntity> {
    return this.duacodersService.findOne(nif);
  }

  @Put(':nif')
  async update(
    @Param('nif') nif: string,
    @Body() updateDuacoderDto: Partial<DuacoderEntity>,
  ): Promise<DuacoderEntity> {
    return this.duacodersService.update(nif, updateDuacoderDto);
  }

  @Delete(':nif')
  async remove(@Param('nif') nif: string): Promise<void> {
    return this.duacodersService.remove(nif);
  }

  @Get('export/pdf/:nif')
  @ApiOperation({ summary: 'Exporta la ficha de un duacoder a un archivo PDF' })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF generado exitosamente.',
  })
  async exportPdf(
    @Param('nif') nif: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.duacodersService.exportToPDF(nif);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${nif}.pdf`,
    });
    res.send(buffer);
  }

  @Get('export/excel')
  @ApiOperation({
    summary: 'Exporta la ficha de un duacoder a un archivo Excel',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado exitosamente.',
  })
  async exportExcel(@Res() res: Response): Promise<void> {
    const buffer = await this.duacodersService.exportToExcel();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=duacoders.xlsx',
    });
    res.send(buffer);
  }
}
