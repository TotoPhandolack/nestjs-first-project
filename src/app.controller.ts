import { Controller, Get, Post, Body } from '@nestjs/common';
import * as appService from './app.service'; // import service เข้ามา

@Controller('users')
export class UsersController {
  // นี่แหละครับคือ Dependency Injection!
  // การประกาศใน constructor แบบนี้ NestJS จะไปหยิบ UsersService มาใส่ในตัวแปร usersService ให้เราเองอัตโนมัติ
  constructor(private readonly usersService: appService.UsersService) {}

  @Get()
  findAll(): appService.User[] {
    // Controller ไม่ต้องคิดเอง โยนงานให้ Service จัดการส่งข้อมูลกลับมา
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() user: appService.User) {
    // โยนข้อมูลที่รับมาไปให้ Service จัดการเซฟ
    this.usersService.create(user);
    return 'User added successfully!';
  }
}
