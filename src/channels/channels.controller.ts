import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
    @Get()
    getAllChannels() {

    }

    @Get(':name')
    getSpecificChannel() {

    }

    @Post()
    createChannels() {

    }

    @Get(':name/chats')
    getChats(@Query() query, @Param() param) {
        console.log(query.perpage, query.page);
        console.log(param.id, param.url);
    }

    @Post(':name/chats')
    createChat(@Body() body) {
        
    }

    @Get(':name/members')
    getAllMembers() {

    }

    @Post(':name/members')
    inviteMembers() {

    }
}
