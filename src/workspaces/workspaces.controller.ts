import { Controller, Delete, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces() {

  }

  @Post()
  createWorkspaces() {

  }

  @Get(":url/members")
  getAllmembersFromWorkspace() {

  }

  @Post(":url/members")
  inviteMembersToWorkspace() {

  }

  @Delete(":url/members/:id")
  kickMemberFromWorkspace() {
    
  }

  @Get(":url/members/:id")
  getMemberInfoInWorkspace() {

  }
}
