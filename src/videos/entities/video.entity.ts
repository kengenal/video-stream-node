import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Index()
  @Column()
  name: string;

  @Column()
  prefix: string;

  @Column()
  fullPath: string;

  get fullPathP(): string {
    return `/videos/${this.slug}`;
  }

  public static fromFactory(params: {
    slug: string;
    name: string;
    fullPath: string;
    prefix: string;
  }): Videos {
    const video = new Videos();
    video.slug = params.slug;
    video.name = params.name;
    video.prefix = params.prefix;
    video.fullPath = params.fullPath;
    return video;
  }
}
