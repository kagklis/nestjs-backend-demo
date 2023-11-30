import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDTO) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: dto.password,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      console.log(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use!');
        }
      }
      throw error;
    }
  }
}
