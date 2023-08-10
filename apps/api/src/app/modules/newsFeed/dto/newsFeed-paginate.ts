import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@social-zone/common';
import { AvatarImage } from '../../users/dto/ProfileData';
import { PhotosImageInput } from '../../posts/entities/post';

@ObjectType()
export class Author {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => AvatarImage)
  avatar: AvatarImage | string

  @Field(() => String)
  name: string;
}

@ObjectType()
export class NewsFeedPaginate {
  @Field(() => [PhotosImageInput], { nullable: true })
  photos: PhotosImageInput[];

  @Field(() => String, { nullable: true })
  content: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Author)
  author: Author;

  @Field(() => Boolean)
  isLiked: boolean;

  @Field(() => Boolean)
  isOwnPost: boolean;

  @Field(() => Number)
  commentsCount: number;

  @Field(() => Number)
  likesCount: number;

  @Field(() => String)
  id: string;
}

@ObjectType()
export class NewsFeedPagination extends Paginated(NewsFeedPaginate) {}





