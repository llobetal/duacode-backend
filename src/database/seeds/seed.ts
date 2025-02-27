import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DuacodersService } from '../../modules/duacoders/duacoders.service';
import { UsersService } from '../../users/users.service';
import {
  DuacoderEntity,
  OmeletteType,
} from 'src/modules/duacoders/entities/duacoder.entity/duacoder.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const duacodersService = app.get(DuacodersService);
  const usersService = app.get(UsersService);

  try {
    const sampleDuacoders: Partial<DuacoderEntity>[] = [
      {
        nif: '12345678A',
        nombre: 'Paco Pérez',
        biografia: 'Desarrollador NodeJS y NestJS',
        departamento: 'Desarrollo',
        puesto: 'Backend Developer',
        skills: ['NodeJS', 'NestJS', 'TypeORM'],
        foto: 'https://example.com/foto1.jpg',
        OmeletteType: OmeletteType.WITH_ONION,
        fechaNacimiento: new Date('1990-01-01'),
      },
      {
        nif: '87654321B',
        nombre: 'Marina Díaz',
        biografia: 'Experta en APIs y microservicios',
        departamento: 'Innovación',
        puesto: 'Arquitecta de Software',
        skills: ['REST', 'GraphQL', 'Docker'],
        foto: 'https://example.com/foto2.jpg',
        OmeletteType: OmeletteType.WITHOUT_ONION,
        fechaNacimiento: new Date('1985-05-15'),
      },
    ];

    for (const data of sampleDuacoders) {
      try {
        await duacodersService.create(data);
        console.log(`Duacoder con NIF ${data.nif} creado exitosamente.`);
      } catch (error) {
        console.error(`Error al crear el duacoder con NIF ${data.nif}:`, error);
      }
    }

    try {
      const existingUser = await usersService.findByUsername('admin');

      if (!existingUser) {
        await usersService.createUser('admin', 'admin123');
        console.log('Usuario admin creado exitosamente.');
      } else {
        console.log('Usuario admin ya existe. No se crea nuevamente.');
      }
    } catch (error) {
      console.error('Error al crear el usuario admin:', error);
    }
  } catch (error) {
    console.error('Error en el seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
