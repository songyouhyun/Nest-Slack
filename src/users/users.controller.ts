import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/Interceptors/undefinedToNull.interceptor';
import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { LoggedInGuard } from '../auth/guard/logged-in.guard';
import { NotLoggedInGuard } from '../auth/guard/not-logged-in.guard';

@UseInterceptors(UndefinedToNullInterceptor) // 앞으로 이 컨트롤러에서 return 하는 값이 undefined 라면 다 null 로 치환
@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: '내정보 조회' })
  @ApiResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @Get()
  getUsers(@User() user) {
    return user || false; // user parameter = request.user
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(new NotLoggedInGuard())
  @Post()
  async join(@Body() body: JoinRequestDto) {
    await this.userService.join(body.email, body.nickname, body.password);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(new LocalAuthGuard())
  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(new LoggedInGuard())
  @Post('logOut')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
