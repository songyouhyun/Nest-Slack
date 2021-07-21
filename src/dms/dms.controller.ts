import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger'

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
    @ApiParam({
        name: 'url',
        description: '워크스페이스 url',
        required: true,
    })
    @ApiQuery({
        name: 'perPage',
        description: '한번에 가져오는 개수',
        required: true,
    })
    @ApiQuery({
        name: 'page',
        description: '불러올 페이지',
        required: true,
    })
    @ApiQuery({
        name: 'id',
        description: '사용자 아이디',
        required: true,
    })
    @Get(':id/chats')
    getChar(@Query() query, @Param() param) {
        console.log(query.perpage, query.page);
        console.log(param.id, param.url);
    }

    @Post(':id/chats')
    postChat(@Body() body) {
        
    }


}
