import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesRepository } from './files.repository';
import { User } from 'src/auth/user.entity';
import axios from 'axios';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesRepository)
    private filesRepository: FilesRepository,
  ) {}

  async getFile(user: User): Promise<string> {
    return this.filesRepository.getFile(user);
  }

  async uploadFile(image: Express.Multer.File, user: User): Promise<string> {
    return this.filesRepository.uploadFile(image, user);
  }

  async deleteFile(user: User): Promise<void> {
    const result = await this.filesRepository.delete({
      userId: user.id,
    });
  }
}
