import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':ws_id')
  getOne(@Param('ws_id') ws_id: string) {
    return this.usersService.findOne(ws_id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':ws_id')
  update(@Param('ws_id') ws_id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(ws_id, updateUserDto);
  }
}
