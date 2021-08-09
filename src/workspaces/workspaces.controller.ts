import { Controller, Delete, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { Users } from '../entities/Users';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspaces() {}

  @Get(':url/members')
  getAllmembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
