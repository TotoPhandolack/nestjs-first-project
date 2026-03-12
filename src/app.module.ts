import { Module } from '@nestjs/common';
import { UsersController } from './app.controller';
import { UsersService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ProductsModule, PrismaModule, CategoriesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
