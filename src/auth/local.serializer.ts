import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }
  //  user 객체에 대응하는 암호를 만드는 역할
  serializeUser(user: any, done: CallableFunction): any {
    done(null, user.id);
  }

  // 다시 암호를 user 객체로 풀어주는 역할
  // 즉, user => hashed_sessionID, hashed_sessionID => user
  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail(
        { id: +userId },
        {
          select: ['id', 'email', 'nickname'],
          relations: ['Workspaces'],
        },
      )
      .then((user) => {
        console.log('user', user);
        done(null, user); // req.user
      })
      .catch((error) => done(error));
  }
}
