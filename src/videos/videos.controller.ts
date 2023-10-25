import {
  Controller,
  Get,
  Param,
  Headers,
  HttpStatus,
  Header,
  Res,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { statSync, createReadStream } from 'fs';
import { VideosService } from './videos.service';
import { Response } from 'express';
import { VideoQueryDto } from './dto/video-query.dto';

@Controller('videos')
export class VideosController {
  constructor(private videoService: VideosService) {}

  @Get()
  getAll(@Query() query: VideoQueryDto) {
    const queryTerm = query.q ?? '';
    return this.videoService.findAll(queryTerm);
  }

  @Get('index')
  indexVideos() {
    this.videoService.reindex();
    return { message: 'Indexing..', statusCode: HttpStatus.OK };
  }

  @Get(':slug')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(
    @Param('slug') slug: string,
    @Headers() headers: any,
    @Res() res: Response,
  ) {
    const video = await this.videoService.findBySlug(slug);
    if (!video) {
      throw new BadRequestException('Video not found');
    }

    const videoPath = video.fullPath;
    const { size } = statSync(videoPath);
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunksize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
    }
  }
}
