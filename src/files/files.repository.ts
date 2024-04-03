import { EntityRepository, Repository } from 'typeorm';
import { File } from './files.entity';
import { FilesService } from './files.service';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';

@EntityRepository(File)
export class FilesRepository extends Repository<File> {
  private logger = new Logger('FileRepository');

  async getFile(user: User): Promise<string> {
    const query = this.createQueryBuilder('file');

    query.where('file.userId = :userId', { userId: user.id });

    try {
      const file = await query.getOne();
      return file.url;
    } catch (error) {
      this.logger.error(
        `Failed to get file for user "${user.username}".`,
        error.stack,
      );
      /*       throw new InternalServerErrorException(); */
    }
  }

  async uploadFile(image: Express.Multer.File, user: User): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', image.buffer.toString('base64'));

      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=4a54434e3272001589a076053c69863c',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const file = new File();
      file.url = response.data.data.url;
      file.user = user;

      const files = await this.getFile(user);
      try {
        if (files) {
          this.logger.debug(`Updating "${user.username}" file url.`);
          this.update({ user: user }, { url: file.url });
        } else {
          this.logger.debug(`Saving "${user.username}" file url.`);
          await file.save();
        }
      } catch (error) {
        this.logger.error(
          `Failed to create a file for user "${user.username}".`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
      delete file.user;

      return response.data.data.url;
    } catch (error) {
      this.logger.error(error.stack);
      throw new Error('Failed to upload image to ImgBB');
    }
  }
}
