import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../typeorm/entities/comment.entity';
import { Post } from '../../typeorm/entities/post.entity';
import { User } from '../../typeorm/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }

  async findForPost(postId: number) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post not found');
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'ASC' } as any,
    });
  }

  async create(postId: number, userId: number, content: string) {
    const post = await this.postRepo.findOneBy({ id: postId });
    const user = await this.userRepo.findOneBy({ id: userId });
    // Create a strongly-typed Comment entity instance
    const commentEntity = new Comment();
    commentEntity.content = content;
    commentEntity.post = post as Post;
    commentEntity.user = user as User;
    // Save returns a single Comment when given a single entity
    const saved = await this.commentRepo.save(commentEntity);
    // Always return the comment with user relation
    return this.commentRepo.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }
}