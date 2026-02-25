import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 💡 แปะ @Global() ไว้ แผนกอื่นจะได้เรียกใช้ Prisma ได้เลยโดยไม่ต้อง import Module นี้ซ้ำๆ
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // สำคัญมาก! ต้อง export ออกไปให้คนอื่นใช้
})
export class PrismaModule {}
