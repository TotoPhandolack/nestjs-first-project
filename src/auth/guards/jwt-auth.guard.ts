import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. ดึงบัตร VIP (Token) ออกมาจาก Header ของ Request
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('คุณไม่มีบัตร VIP (ไม่พบ Token)!');
    }

    try {
      // 2. เอาบัตรไปตรวจสอบกับลายเซ็นลับของเราว่าของแท้ไหม และหมดอายุหรือยัง
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'MY_SUPER_SECRET_KEY', // 🗝️ ต้องตรงกับตอนที่ออกบัตรนะ
      });

      // 3. ถ้าบัตรแท้! ให้เอาข้อมูลบนบัตร (id, email) ไปแขวนคอไว้ที่ตัว request
      // เพื่อให้ฟังก์ชันอื่นดึงไปใช้ต่อได้
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('บัตร VIP ของคุณปลอม หรือหมดอายุแล้ว!');
    }

    return true; // ยอมให้เดินผ่านประตูไปได้
  }

  // ฟังก์ชันช่วยแกะ Token ออกมาจากคำว่า "Bearer <token>"
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
