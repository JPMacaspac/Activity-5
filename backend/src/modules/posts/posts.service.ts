import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../typeorm/entities/post.entity';
import { User } from '../../typeorm/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  private toResponse(post: Post) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.images || null, // Single image string (stored in 'images' column)
      images: post.images || null, // Legacy compatibility
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user
        ? {
            id: (post.user as any).id,
            username: (post.user as any).username,
          }
        : null,
    };
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = await this.postRepo.find({
      relations: ['user', 'comments'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });
    // Normalize response with parsed images and minimal user
    return posts.map((p) => this.toResponse(p));
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments'],
    });
    if (!post) throw new NotFoundException('Post not found');
    // Normalize response
    return this.toResponse(post);
  }

  async create(dto: any, userId: number) {
    console.log('=== CREATE POST DEBUG ===');
    console.log('userId:', userId);
    console.log('dto:', JSON.stringify(dto).substring(0, 200)); // Log first 200 chars
    
    if (!userId) {
      throw new NotFoundException('User ID is required');
    }
    
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    console.log('Found user:', user.username);
    
    const post = this.postRepo.create({
      title: dto.title,
      content: dto.content,
      images: dto.image || null,
      user: user,
    });
    
    console.log('Created post entity, saving...');
    const savedPost = await this.postRepo.save(post);
    console.log('Saved post ID:', savedPost.id);
    
    const fullPost = await this.postRepo.findOne({
      where: { id: savedPost.id },
      relations: ['user'],
    });
    
    console.log('Fetched full post with user:', fullPost?.user?.username);
    console.log('=== END DEBUG ===');
    
    return this.toResponse(fullPost as Post);
  }

  async update(id: number, dto: any, userId: number) {
    // Fetch the entity directly without parsing
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    post.title = dto.title || post.title;
    post.content = dto.content || post.content;
    // Update single image if provided
    if (dto.image !== undefined) {
      post.images = dto.image || null;
    }
    post.user = user;
    await this.postRepo.save(post);
    // Always fetch with user relation after update
    const fullPost = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!fullPost) throw new NotFoundException('Post not found after update');
    return this.toResponse(fullPost as Post);
  }

  async remove(id: number) {
    const res = await this.postRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Post not found');
  }
}