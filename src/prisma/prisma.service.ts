import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อ NestJS สตาร์ท เพื่อเปิดการเชื่อมต่อ Database
  async onModuleInit() {
    await this.$connect();
  }
}
