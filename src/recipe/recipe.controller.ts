import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RequestWithUser } from 'src/auth/requestwithuser.model';
import { ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/guards/logged-in/logged-in.guard';
import { OwnershipGuard } from 'src/guards/ownership/ownership.guard';

@Controller('recipe')
@ApiTags('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(LoggedInGuard)
  async create(
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() request: RequestWithUser,
  ) {
    createRecipeDto.userId = request.user.id;

    return await this.recipeService.create(createRecipeDto);
  }

  @Get()
  @UseGuards(LoggedInGuard)
  findAll() {
    return this.recipeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findOne(id);
  }

  // todo: check permission
  @Patch(':id')
  @UseGuards(LoggedInGuard, OwnershipGuard('recipe'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Req() request: RequestWithUser,
  ) {
    updateRecipeDto.userId = request.user.id;

    return await this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.remove(id);
  }
}
