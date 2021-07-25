import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // 컨트롤러 실행 전 부분
        return next.handle().pipe(map((data) => (data === undefined ? null : data)));
    }
}

// Interceptor의 기능 : 컨트롤러로 가기 전, 마지막에 한번 더 데이터를 가공해주는 역할

// {rxjs} map 함수 : 원래 데이터가 있다면 원래 데이터를 다른 데이터와 1대1로 바꿔주는 역할
// {rxjs} pipe 함수 : pipe 함수 안에 있는 함수들을 하나씩 순서대로 적용해주는 함수