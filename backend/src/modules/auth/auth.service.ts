import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../typeorm/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) throw new BadRequestException('Email already in use');
    
    const pwHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ 
      username: dto.username, 
      email: dto.email, 
      password: pwHash 
    });
    await this.userRepo.save(user);
    
    const token = this.jwtService.sign({ sub: user.id });
    return { user: { id: user.id, username: user.username, email: user.email }, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    
    const token = this.jwtService.sign({ sub: user.id });
    return { user: { id: user.id, username: user.username, email: user.email }, token };
  }
}