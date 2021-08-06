import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Users } from 'src/entities/Users';
import * as bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
  ) {}
  getUser() {}
  // 사용자를 만들고, 바로 workspace와 channel에 들어가게 하는 method
  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const joinedUser = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
    // seeding된 첫번째 workspace인 'slect'에다가, 위에서 회원가입된 user를 넣어주는 save문
    await this.workspaceMembersRepository.save({
      UserId: joinedUser.id,
      WorkspaceId: 1,
    });
    await this.channelMembersRepository.save({
      UserId: joinedUser.id,
      ChannelId: 1,
    });
    return true;
  }
}
