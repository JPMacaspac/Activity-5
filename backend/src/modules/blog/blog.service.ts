import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../typeorm/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create(dto as Partial<Post>);
    const saved = await this.postRepo.save(post as Post);
    return saved as Post;
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async remove(id: number): Promise<void> {
    const res = await this.postRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Post not found');
  }
}
