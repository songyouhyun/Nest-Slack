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
  async getWorkspaceChannels(myId: number, url: string) {
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

  // Workspace에 Channel 추가
  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const channel = this.channelsRepository.create({
      name: name,
      WorkspaceId: workspace.id,
    });
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMembers = this.channelMembersRepository.create({
      UserId: myId,
      ChannelId: channelReturned.id,
    });
    await this.channelMembersRepository.save(channelMembers); // channelMember로는 항상 '나'를 저장
  }

  // 정확한 채널을 가져오기 위해서는 그냥 channel만 가져와서는 안된다.
  // '일반'이라는 채널으로 예를 들었을 때, 다른 Workspace에도 '일반'이라는 채널이 있을 수 있다.
  // 그럼으로 Workspace의 url도 join을 해서 검색한다.
  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
        name,
      })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }

  // Channel에 Member를 추가하는 method
  async createWorkspaceChannelMembers(url, name, email) {
    // channel 찾기
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!channel) {
      return null;
    }
    // user 찾기
    const user = await this.channelsRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getOne();
    if (!user) {
      return null;
    }
    // channel과 user를 연결해서 channelMembersRepository에 channelMemmber 저장
    const channelMember = await this.channelMembersRepository.create({
      ChannelId: channel.id,
      UserId: user.id,
    });
    await this.channelMembersRepository.save(channelMember);
  }
}
