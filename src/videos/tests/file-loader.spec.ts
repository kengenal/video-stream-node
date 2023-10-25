import * as fs from 'node:fs';
import * as path from 'node:path';
import { FileLoader } from '../file-loader';
import { Videos } from '../entities/video.entity';

const dir = './test_structure';

const fileLoader = new FileLoader(dir);

function createFile(filename: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const directoryPath = path.join(dir, filename);
    fs.mkdirSync(directoryPath);

    const filePath = path.join(directoryPath, filename);
    fs.writeFileSync(filePath, 'Dummy data for test', 'utf-8');
}

beforeEach(() => {
    createFile('video.mp4');
});

test('Get all files from filesstructure', async () => {
    const data = await fileLoader.loadVideos();
    const video = Videos.fromFactory({
        name: 'video',
        slug: 'video',
        prefix: 'mp4',
        fullPath: path.join(dir, 'video.mp4'),
    });

    expect(data).toStrictEqual([video]);
});

test('Get all files from filesstructure but now there is more files', async () => {
    createFile('video2.mp4');
    const data = await fileLoader.loadVideos();
    const video = Videos.fromFactory({
        name: 'video',
        slug: 'video',
        prefix: 'mp4',
        fullPath: path.join(dir, 'video.mp4'),
    });

    const video2 = Videos.fromFactory({
        name: 'video2',
        slug: 'video2',
        prefix: 'mp4',
        fullPath: path.join(dir, 'video2.mp4'),
    });

    expect(data).toStrictEqual([video2, video]);
});

test('Get all files but one file is not mp4', async () => {
    createFile('video2.mp4');
    createFile('test.csv');

    const data = await fileLoader.loadVideos();

    const video = Videos.fromFactory({
        name: 'video',
        slug: 'video',
        prefix: 'mp4',
        fullPath: path.join(dir, 'video.mp4'),
    });

    const video2 = Videos.fromFactory({
        name: 'video2',
        slug: 'video2',
        prefix: 'mp4',
        fullPath: path.join(dir, 'video2.mp4'),
    });

    expect(data).toStrictEqual([video2, video]);
});

test('Get all files but check slug is correcly created', async () => {
    const name = 'this is interesting name';
    const nameWithUderscore = 'this_is_interesting_name';
    createFile(name + '.mp4');
    createFile(nameWithUderscore + '.mp4');

    const data = await fileLoader.loadVideos();

    expect(data[1].slug).toEqual(nameWithUderscore.replaceAll('_', '-'));
    expect(data[2].slug).toEqual(name.replaceAll(/\s/g, '-'));
});

afterEach(() => {
    try {
        fs.rmSync(dir, { recursive: true });
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }
});
