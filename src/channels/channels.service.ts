import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channels } from '../entities/Channels';
import { Repository } from 'typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Workspaces } from '../entities/Workspaces';
import { ChannelChats } from '../entities/ChannelChats';
import { Users } from '../entities/Users';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }
  // Workspace Channel 여러 개 가져오기
  async getWorkspaceChannels(myId: number, url: string,) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId }, // 내가 들어가있는 Channels 다 가져오고
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url }, // 그 채널에 대한 Workspaces도 다 가져오기
      )
      .getMany();
  }

  // Workspace Channel 한 개만 가져오기
  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        name,
      },
      relations: ['Workspace'],
    });
  }
}
