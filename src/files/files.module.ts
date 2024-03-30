import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './files.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileRepository]), AuthModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
