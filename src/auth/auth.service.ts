import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service'; // นำเข้า Prisma
import * as bcrypt from 'bcrypt'; // นำเข้าเครื่องมือเข้ารหัส
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // ดึง PrismaService มาใช้งาน
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
  ) {}

  // เปลี่ยนชื่อฟังก์ชันจาก create เป็น register เพื่อความเข้าใจง่าย
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, name } = createAuthDto;

    // 1. เช็คก่อนว่ามีอีเมลนี้ในระบบหรือยัง?
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('อีเมลนี้ถูกใช้งานไปแล้วครับ!'); // เด้ง Error แจ้งเตือน
    }

    // 2. นำรหัสผ่านไปสับให้ละเอียด (Hash)
    const saltRounds = 10; // ระดับความซับซ้อนของการเข้ารหัส (ยิ่งเยอะยิ่งปลอดภัย แต่ยิ่งช้า)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. เซฟข้อมูลลง Database
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword, // เซฟรหัสผ่านที่สับแล้วเท่านั้น!
        name,
      },
    });

    // 4. ส่งข้อมูลกลับไปให้ดู (แต่ต้องไม่ส่งรหัสผ่านกลับไปนะ!)
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };
  }

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้องครับ!');
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้องครับ!');
    }

    const paylaod = { id: user.id, email: user.email };

    const accessToken = await this.JwtService.signAsync(paylaod);

    // ถ้าเข้ารหัสได้สำเร็จ ให้ส่งข้อมูลผู้ใช้กลับไป
    return {
      message: 'เข้าสู่ระบบสำเร็จ! 🎉',
      access_token: accessToken,
    };
  }

  // ดึงข้อมูล User ทั้งหมด
  async findAll(): Promise<any> {
    // 👈 เติม : Promise<any> ตรงนี้ครับ
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }
}
