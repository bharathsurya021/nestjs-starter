import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];
  private idCounter = 1;

  create(createCatDto: CreateCatDto) {
    const newCat = { id: this.idCounter.toString(), ...createCatDto };
    this.cats.push(newCat);
    this.idCounter++;
    return newCat;
  }

  findAll(limit?: number) {
    return this.cats.slice(0, limit);
  }

  findOne(id: string) {
    const cat = this.cats.find((cat) => cat.id === id);
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  update(id: string, updateCatDto: UpdateCatDto) {
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    this.cats[catIndex] = { ...this.cats[catIndex], ...updateCatDto };
    return this.cats[catIndex];
  }

  remove(id: string) {
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    const removedCat = this.cats.splice(catIndex, 1);
    return removedCat[0];
  }
}
