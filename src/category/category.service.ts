import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "./category.model";
import { ModifyCategoryDto } from "./dto/modifyCategory.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository:typeof Category)
  {  }

  async createCategory(dto: ModifyCategoryDto)
  {
    const category = await this.categoryRepository.create(dto);
    if(category)
    {
      return category;
    }
    throw new HttpException('Категория не создана.',HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async updateCategory(id:number,dto: ModifyCategoryDto)
  {
    const category = await this.categoryRepository.findByPk(id);
    if(category)
    {
      return await this.categoryRepository.update(dto,{where: {id}});
    }
    throw new HttpException('Категория для обновления не найдена',HttpStatus.NOT_FOUND);
  }

  async getById(id:number)
  {
    const category = await this.categoryRepository.findByPk(id);
    if(category)
    {
      return category;
    }
    throw new HttpException('Категория не найдена',HttpStatus.NOT_FOUND);
  }

  async deleteCategory(id:number)
  {
    const category = await this.categoryRepository.findByPk(id);
    if(category)
    {
      return await this.categoryRepository.destroy({where :{id}});
    }
    throw new HttpException('Категория для удаления не найдена',HttpStatus.NOT_FOUND);
  }
}
