import { Controller, Get, Post as HttpPost, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findForPost(@Param('postId') postId: string) {
    return this.commentsService.findForPost(Number(postId));
  }

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  create(@Param('postId') postId: string, @Request() req: any, @Body('content') content: string) {
    return this.commentsService.create(Number(postId), req.user.id, content);
  }
}

