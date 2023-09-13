import { Injectable } from '@nestjs/common';
import { Ingredient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private prisma: PrismaService) {}

  create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.prisma.ingredient.create({ data: createIngredientDto });
  }

  findAll(name: string): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany({
      where: {
        name: { contains: name },
      },
    });
  }

  findOne(id: number): Promise<Ingredient> {
    return this.prisma.ingredient.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    return this.prisma.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  remove(id: number): Promise<Ingredient> {
    return this.prisma.ingredient.delete({ where: { id } });
  }
}
