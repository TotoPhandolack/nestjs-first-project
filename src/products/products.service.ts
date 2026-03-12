import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

// 1. นำเข้า Type 'Product' ที่ Prisma สร้างไว้ให้
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 2. ระบุว่าฟังก์ชันนี้จะคืนค่ากลับมาเป็น Promise ที่มีข้อมูลแบบ Product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  // คืนค่าเป็น Array ของ Product (เพราะมีหลายชิ้น)
  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  // คืนค่าเป็น Product 1 ชิ้น หรือ null (ถ้าหาไม่เจอ)
  async findOne(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<Product> {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
