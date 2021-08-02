import { Body, Controller, Get, HttpException, Post, UseInterceptors } from "@nestjs/common";
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/Interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor) // 앞으로 이 컨트롤러에서 return하는 값이 undefined라면 다 null로 치환
@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '내정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user; // user parameter = request.user
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    await this.userService.join(body.email, body.nickname, body.password);
  }

  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logOut')
  logOut() {}
}
