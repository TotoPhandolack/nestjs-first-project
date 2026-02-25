import { Injectable } from '@nestjs/common';

// สร้าง Interface กำหนดรูปร่างของข้อมูล User (ใช้ความรู้ TypeScript ล่าสุดเลยครับ!)
export interface User {
  id: number;
  name: string;
}

// @Injectable() เป็นการบอก NestJS ว่า "คลาสนี้พร้อมให้คนอื่นดึงไปใช้งานแล้วนะ"
@Injectable()
export class UsersService {
  // จำลองฐานข้อมูลแบบง่ายๆ ใน memory (ใช้ private เพื่อไม่ให้ใครแก้ตัวแปรนี้ตรงๆ ได้)
  private users: User[] = [{ id: 1, name: 'John Doe' }];

  // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
  findAll(): User[] {
    return this.users;
  }

  // ฟังก์ชันเพิ่มข้อมูลผู้ใช้ใหม่
  create(user: User) {
    this.users.push(user);
  }
}
