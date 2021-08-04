import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// implements가 아니라 extends인 이유 :
// AuthGuard 안에 CanActivate가 들어있기 때문에 생략되어있다.
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      console.log('login for cookie');
      await super.logIn(request); // 이 콜백은 로컬전략을 통과한 user 객체를 얻게 해준다는 데 의의가 있다.
    }
    return true;
  }
}
