import { IsString } from 'class-validator';

export class CreateUserDto {
  readonly _id: string;

  @IsString()
  ws_id: string;

  @IsString({ each: true })
  blocklist: string[];
}
