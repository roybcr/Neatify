import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(ws_id: string): Promise<User> {
    const user = await this.userModel.findOne({ ws_id }).exec();
    if (!user)
      throw new NotFoundException(`User with socket id #${ws_id} not found!`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // {new: true} is being used in order for mongoose to return back the updated user object.
    const existingUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();
    if (!existingUser)
      throw new NotFoundException(`User with id #${id} not found!`);

    return existingUser;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }
}
