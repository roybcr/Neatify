import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findOne({ _id: id }).exec();
    if (!notification)
      throw new NotFoundException(`Notification with id #${id} not found!`);

    return notification;
  }

  async create(notifications: CreateNotificationDto[]) {
    const notes = notifications.map((n) => {
      return new this.notificationModel(n).save();
    });
    return Promise.all(notes);
  }
}
