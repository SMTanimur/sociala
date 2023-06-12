/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user-input';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from '../../utils/hash';
import { UpdateUserInput } from './dto/update-user-input';
import { CreateOrUpdateProfileInput } from '../Info/dto/create-profile.input';
import { InfoService } from '../Info/Info.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly infoService: InfoService
  ) {}

  async createUser(createUser: CreateUserInput): Promise<string> {
    try {
      const user = await this.userModel.findOne({
        email: createUser.email,
        username: createUser.username,
      });
      if (user) {
      throw new ConflictException('User already exists');
      }
      createUser.password = await createHash(createUser.password);
      const userData = await this.userModel.create(createUser);
      return `Welcome ${userData.username}!`;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserInput) {
    const exitedUser = await this.userModel.findOne({ _id: id });
    if (!exitedUser) {
      throw new ConflictException('User not found');
    }
    const updateData = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      { new: true }
    );
    return updateData;
  }

  async createOrUpdateProfile(
    userId: string,
    createOrUpdateProfileInput: CreateOrUpdateProfileInput
  ) {
    const user = await this.findOne({ _id: userId });

    if (user?._id) {
      await this.infoService.update(user._id, createOrUpdateProfileInput);
      return 'Profile updated';
    }

    const profile = await this.infoService.create(createOrUpdateProfileInput);
    await this.updateUser(userId, { info: profile._id });
    return 'Profile updated';
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).select('-password');

    if (!user) return null;

    return user;
  }
  async findOne(query: object): Promise<UserDocument> {
    const user = await this.userModel.findOne(query);

    if (!user) return null;

    return user;
  }
}
