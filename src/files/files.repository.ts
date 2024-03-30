import { EntityRepository, Repository } from 'typeorm';
import { File } from './files.entity';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  private logger = new Logger('FileRepository');

  async getFiles(user: User): Promise<File> {
    const query = this.createQueryBuilder('file');

    query.where('file.userId = :userId', { userId: user.id });

    try {
      const file = await query.getOne();
      return file;
    } catch (error) {
      this.logger.error(
        `Failed to get file for user "${user.username}".`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async uploadFile(
    avatar: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    user: User,
  ): Promise<File> {
    const { url } = uploadFileDto;

    const file = new File();
    /*     file.url = url;
     */ file.user = user;

    const formData = new FormData();

    formData.append('image', avatar.buffer.toString('base64'));
    console.log(formData);
    const fileUrl = `https://api.imgbb.com/1/upload?key=871135b961a12407d17c16bf1a213c36`;
    fetch(url, {
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    try {
      file.url = fileUrl;
      await file.save();
    } catch (error) {
      this.logger.error(
        `Failed to upload a file for user "${user.username}". Data: ${uploadFileDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete file.user;

    return file;
  }
}
