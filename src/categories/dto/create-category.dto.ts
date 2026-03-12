import { IsString, IsNotEmpty } from 'class-validator';

//Create Interface
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
