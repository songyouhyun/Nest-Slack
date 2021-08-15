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

  // url을 가진 workspace안에 들어 있는 사용자를 데려오는 method
  async getWorkspaceMembers(url: string) {
    this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'w');
  }
}
