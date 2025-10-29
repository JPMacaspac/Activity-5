import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from '../../typeorm/entities/comment.entity';
import { Post } from '../../typeorm/entities/post.entity';
import { User } from '../../typeorm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
