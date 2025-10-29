import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCrudModule } from './modules/user-crud/user-crud.module';
import { BlogModule } from './modules/blog/blog.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...(config.get<string>('DB_HOST')
          ? {
              type: 'mysql',
              host: config.get<string>('DB_HOST'),
              port: config.get<number>('DB_PORT'),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASS'),
              database: config.get<string>('DB_NAME'),
            }
          : {
              type: 'sqlite',
              database: 'dev.sqlite',
            }),
        autoLoadEntities: true,
        synchronize: true, // ✅ Changed back to true
      }),
    }),

    UserCrudModule,
    BlogModule,
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}