import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './files.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
  ) {}

  /*  async getFileById(id: number, user: User): Promise<File> {
    const found = await this.fileRepository.findOne({
      where: { userId: user.id },
    });np

    if (!found) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }

    return found;
  } */

  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    user: User,
  ): Promise<File> {
    return this.fileRepository.uploadFile(file, uploadFileDto, user);
  }

  /* async deleteFile(id: number, user: User): Promise<void> {
    const result = await this.fileRepository.delete({
      userId: user.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
  } */
}
