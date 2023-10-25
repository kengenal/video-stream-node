import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileLoader } from './file-loader';
import { Videos } from './entities/video.entity';

@Module({
  controllers: [VideosController],
  providers: [
    VideosService,
    {
      provide: FileLoader,
      useFactory: () => new FileLoader(process.env.VIDEO_PATH),
    },
  ],
  imports: [TypeOrmModule.forFeature([Videos])],
})
export class VideosModule {}
