import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
