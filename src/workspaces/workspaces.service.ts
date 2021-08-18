import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspaces } from '../entities/Workspaces';
import { Repository, Transaction } from 'typeorm';
import { Channels } from '../entities/Channels';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: { WorkspaceMembers: [{ UserId: myId }] },
    });
  }
  @Transaction()
  async createWorkspace(name: string, url: string, myId: number) {
    // 새로운 workspace 생성
    const workspace = this.workspacesRepository.create({
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspacesRepository.save(workspace);
    // 생성된 workSpace에 '나'(myId)를 추가 (1)
    const workspaceMember = this.workspaceMembersRepository.create({
      UserId: myId,
      WorkspaceId: returned.id,
    });
    // '일반'이라는 이름의 새로운 Channel 생성
    const channel = this.channelsRepository.create({
      name: '일반',
      WorkspaceId: returned.id,
    });
    // Workspace에 '나' 추가하는 것과 workspace에 channel을 만드는 것은 동시에 진행 (2)
    // 즉, await를 이용한 비동기적 처리 말고 동기적으로 일을 처리하면 더 빠르다는 말
    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);
    // 생성된 channel에 '나'(myId)를 추가
    const channelMember = this.channelMembersRepository.create({
      UserId: myId,
      ChannelId: channelReturned.id,
    });
    // (3)
    await this.channelMembersRepository.save(channelMember);
  }

  // 해당 url을 가진 workspace안에 들어 있는 사용자들을 모두 데려오는 method
  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }
  // 해당 url을 가진 workspace안에 들어 있는 사용자를 한 명만 데려오는 method
  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoinAndSelect(
        'user.Workspaces',
        'workspaces',
        'workspaces.url = :url',
        {
          url,
        },
      )
      .getOne();
  }

  // Workspace에 사람을 초대하는 method
  async createWorkspaceMembers(url, email) {
    // 먼저 Workspace를 찾는다.
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['Channels'], // workspace에 있는 channel들이 다 딸려들어옴, join과 똑같음
      // QueryBuilder를 사용한 코드 ⤵️
      // this.workspaceRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne();
      // QueryBuilder || join || relations
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // workspace에 초대할 사용자를 email로 찾고
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    // workspace에 해당 사용자를 추가해서
    const workspaceMember = this.workspaceMembersRepository.create({
      WorkspaceId: workspace.id,
      UserId: user.id,
    });
    // 저장하고
    await this.workspaceMembersRepository.save(workspaceMember);
    // 모든 채널에 바로 초대하는게 아니라 '일반' 채널, 즉 기본 채널에만 먼저 추가
    const channelMember = this.channelMembersRepository.create({
      ChannelId: workspace.Channels.find((v) => v.name === '일반').id,
      UserId: user.id,
    });
    // 그리고 저장
    await this.channelMembersRepository.save(channelMember);
  }
}
