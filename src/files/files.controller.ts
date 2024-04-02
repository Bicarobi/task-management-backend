import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('files')
@UseGuards(AuthGuard())
export class FilesController {
  private logger = new Logger('TasksController');
  constructor(private filesService: FilesService) {}

  @Get()
  getFile(@GetUser() user: User): Promise<string> {
    this.logger.verbose(`User "${user.username}" retrieving file.`);
    return this.filesService.getFile(user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<string> {
    this.logger.verbose(`User "${user.username}" uploading a new file.`);
    console.log(image);
    return this.filesService.uploadFile(image, user);
  }
}
