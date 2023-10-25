import * as path from 'node:path';
import { glob } from 'glob';
import { Videos } from './entities/video.entity';

export class FileLoader {
  constructor(public pathString: string) {}

  async loadVideos(): Promise<Videos[]> {
    const files = await glob(this.pathString + '**/*.mp4');

    return files.map((pathString: string) => {
      return Videos.fromFactory({
        name: this.getName(pathString),
        slug: this.getSlug(pathString),
        prefix: this.getPrefix(pathString),
        fullPath: this.getFullPath(pathString),
      });
    });
  }

  private getName(pathString: string): string {
    return path.basename(pathString, '.mp4').replaceAll('-', ' ');
  }

  private getSlug(pathString: string) {
    return path
      .basename(pathString, '.mp4')
      .replaceAll(/\s/g, '-')
      .replaceAll('_', '-');
  }

  private getPrefix(pathString: string) {
    return path.extname(pathString).replace('.', '');
  }
  private getFullPath(pathString: string): string {
    return pathString;
  }
}
