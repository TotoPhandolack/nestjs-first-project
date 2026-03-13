import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 👈 เปลี่ยนชื่อเส้นทางเป็น /auth/register เพื่อให้ชัดเจน
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('users')
  async findAll(): Promise<any> {
    // 👈 เติม : Promise<any> บอกว่าเดี๋ยวจะส่งข้อมูลอะไรบางอย่างกลับไปนะ
    return await this.authService.findAll();
  }
}
