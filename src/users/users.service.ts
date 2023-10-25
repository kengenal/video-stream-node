import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findOne(username: string): Promise<Users> {
    return await this.usersRepository.findOneBy({
      username: username,
    });
  }

  async create(userData: {
    username: string;
    password: string;
  }): Promise<boolean> {
    const user = new Users();
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.username = userData.username;
    user.password = hashedPassword;

    this.usersRepository.save(user);
    return true;
  }
}
