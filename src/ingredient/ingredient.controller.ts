import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { RequestWithUser } from 'src/auth/requestwithuser.model';
import { IngredientEntity } from './entities/ingredient.entity';
import { LoggedInGuard } from 'src/auth/guards/logged-in/logged-in.guard';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('ingredient')
@ApiTags('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 200, type: IngredientEntity })
  async create(
    @Body() createIngredientDto: CreateIngredientDto,
    @Req() request: RequestWithUser,
  ): Promise<IngredientEntity> {
    createIngredientDto.userId = request.user.id;

    const newIngr = await this.ingredientService.create(createIngredientDto);

    return new IngredientEntity(newIngr);
  }

  @Get('/name/:name')
  @ApiOkResponse({ status: 200, type: IngredientEntity, isArray: true })
  async findAll(@Param('name') name: string) {
    const ingredients = await this.ingredientService.findAll(name);

    return ingredients.map((ingredient) => new IngredientEntity(ingredient));
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: IngredientEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IngredientEntity> {
    const ingredient = await this.ingredientService.findOne(id);

    return new IngredientEntity(ingredient);
  }

  @Patch(':id')
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 200, type: IngredientEntity })
  @ApiUnauthorizedResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @Req() request: RequestWithUser,
  ): Promise<IngredientEntity> {
    const ingredient = await this.ingredientService.findOne(id);

    if (
      ingredient &&
      (request.user.id === ingredient.userId || request.user.role === 'ADMIN')
    ) {
      const updIngredient = await this.ingredientService.update(
        id,
        updateIngredientDto,
      );

      return new IngredientEntity(updIngredient);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':id')
  @UseGuards(LoggedInGuard)
  @HttpCode(204)
  @ApiOkResponse({ status: 204, description: 'Ingredient removed' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const ingredient = await this.ingredientService.findOne(id);

    if (
      ingredient &&
      (request.user.id === ingredient.userId || request.user.role === 'ADMIN')
    ) {
      await this.ingredientService.remove(id);

      return null;
    } else {
      throw new NotFoundException();
    }
  }
}
