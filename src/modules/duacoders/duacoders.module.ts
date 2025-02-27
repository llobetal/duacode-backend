import { Module } from '@nestjs/common';
import { DuacodersController } from './duacoders.controller';
import { DuacodersService } from './duacoders.service';
import { DuacoderEntity } from './entities/duacoder.entity/duacoder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DuacoderEntity])],
  controllers: [DuacodersController],
  providers: [DuacodersService],
  exports: [DuacodersService, TypeOrmModule],
})
export class DuacodersModule {}
