import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DuacoderEntity } from './entities/duacoder.entity/duacoder.entity';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class DuacodersService {
  constructor(
    @InjectRepository(DuacoderEntity)
    private readonly duacoderRepository: Repository<DuacoderEntity>,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    filters?: Partial<DuacoderEntity>,
  ): Promise<DuacoderEntity[]> {
    const query = this.duacoderRepository.createQueryBuilder('duacoder');
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.andWhere(`duacoder.${key} = :${key}`, { [key]: value });
      });
    }

    query.skip((page - 1) * limit).take(limit);
    return query.getMany();
  }

  async findOne(nif: string): Promise<DuacoderEntity> {
    const duacoder = await this.duacoderRepository.findOne({ where: { nif } });
    if (!duacoder) {
      throw new Error('Duacoder not found');
    }
    return duacoder;
  }
  async update(
    nif: string,
    data: Partial<DuacoderEntity>,
  ): Promise<DuacoderEntity> {
    await this.duacoderRepository.update({ nif }, data);
    return this.findOne(nif);
  }

  async remove(nif: string): Promise<void> {
    await this.duacoderRepository.delete(nif);
  }
  async create(data: Partial<DuacoderEntity>): Promise<DuacoderEntity> {
    const duacoder = this.duacoderRepository.create(data);
    return this.duacoderRepository.save(duacoder);
  }

  async exportToExcel(filters?: Partial<DuacoderEntity>): Promise<Buffer> {
    const duacoders = await this.findAll(1, 1000, filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Duacoders');

    worksheet.addRow([
      'NIF',
      'Nombre',
      'Biografía',
      'Departamento',
      'Puesto',
      'Skills',
      'Foto',
      'Preferencia de Tortilla',
      'Fecha de Nacimiento',
    ]);

    duacoders.forEach((duacoder) => {
      try {
        const fechaNacimiento =
          duacoder.fechaNacimiento instanceof Date
            ? duacoder.fechaNacimiento
            : new Date(duacoder.fechaNacimiento);
        worksheet.addRow([
          duacoder.nif || 'N/A',
          duacoder.nombre || 'N/A',
          duacoder.biografia || 'N/A',
          duacoder.departamento || 'N/A',
          duacoder.puesto || 'N/A',
          duacoder.skills ? duacoder.skills.join(', ') : 'N/A',
          duacoder.foto || 'N/A',
          duacoder.OmeletteType || 'N/A',
          fechaNacimiento instanceof Date && !isNaN(fechaNacimiento.getTime())
            ? fechaNacimiento.toISOString().split('T')[0]
            : 'N/A',
        ]);
      } catch (error) {
        console.error('Error al agregar fila para el Duacoder:', duacoder);
        console.error(error);
      }
    });

    const buffer = (await workbook.xlsx.writeBuffer()) as Buffer;
    return buffer;
  }

  async exportToPDF(nif: string): Promise<Buffer> {
    const duacoder = await this.findOne(nif);

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    const fechaNacimiento =
      duacoder.fechaNacimiento instanceof Date
        ? duacoder.fechaNacimiento
        : new Date(duacoder.fechaNacimiento);

    doc.fontSize(20).text('Ficha Duacoder', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`NIF: ${duacoder.nif}`);
    doc.text(`Nombre: ${duacoder.nombre}`);
    doc.text(`Biografía: ${duacoder.biografia || 'N/A'}`);
    doc.text(`Departamento: ${duacoder.departamento || 'N/A'}`);
    doc.text(`Puesto: ${duacoder.puesto || 'N/A'}`);
    doc.text(`Skills: ${duacoder.skills ? duacoder.skills.join(', ') : 'N/A'}`);
    doc.text(`Preferencia de Tortilla: ${duacoder.OmeletteType}`);
    if (fechaNacimiento) {
      doc.text(
        `Fecha de Nacimiento: ${fechaNacimiento.toISOString().split('T')[0]}`,
      );
    }
    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(new Error(err.message)));
    });
  }
}
