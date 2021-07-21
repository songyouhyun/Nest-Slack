import { ApiProperty } from '@nestjs/swagger'

export class JoinRequestDto {
    @ApiProperty({
        example: '송유현@gmail.com',
        description: '이메일',
        required: true
    })
    public email: string;

    @ApiProperty({
        example: '송유현',
        description: '이름',
        required: true
    })
    public nickname: string;

    @ApiProperty({
        example: '12345678',
        description: '비밀번호',
        required: true
    })
    public password: string;
}