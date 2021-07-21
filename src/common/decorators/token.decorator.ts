import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.decorator";

export const Token = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const response = ctx.switchToHttp().getResponse();
        return response.locals.jwt;
    }
);

// @Token token

// ctx(실행컨텍스트)가 쓰이는 이유
// Nest로 한 서버에서 여러가지(HTTP, RPC, WebSocket)등을 동시에 돌릴 수 있는데, 모두다 하나의 실행컨텍스트 안에서 관리를 한다.
// ctx는 HTTP, WebSocket, RPC 등 이 세 개를 하나의 객체로 접근하기 위해 사용된다.
// 지금 이 Slack 클론 코딩에서는 실시간 채팅을 만들때 WebSocket과 HTTP 서버가 같이 돌아간다.
