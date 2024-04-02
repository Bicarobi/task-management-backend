import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository } from './files.repository';
import { AuthModule } from 'src/auth/auth.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesRepository]),
    AuthModule,
    MulterModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
