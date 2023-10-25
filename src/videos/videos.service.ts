import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FileLoader } from './file-loader';
import { Videos } from './entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Videos)
    private videoRepository: Repository<Videos>,
    private fileLoader: FileLoader,
  ) {}

  async index(): Promise<void> {
    const data = await this.fileLoader.loadVideos();
    this.videoRepository.save(data);
  }

  findAll(q?: string): Promise<Videos[]> {
    return this.videoRepository.find({
      where: { name: Like(`%${q}%`) },
      select: ['name', 'slug', 'prefix'],
    });
  }

  findBySlug(slug: string): Promise<Videos> {
    return this.videoRepository.findOneBy({ slug: slug });
  }

  async reindex(): Promise<void> {
    await this.videoRepository.delete({});
    await this.index();
  }
}
