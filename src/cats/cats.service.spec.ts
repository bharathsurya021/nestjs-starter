import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { NotFoundException } from '@nestjs/common';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new cat with a string ID', () => {
    const createCatDto: CreateCatDto = {
      name: 'Tom',
      age: 3,
      breed: 'Siamese',
    };
    const cat = service.create(createCatDto);
    expect(cat).toHaveProperty('id');
    expect(cat.id).toMatch(/^\d+$/); // Ensure ID is a string
    expect(cat.name).toBe('Tom');
    expect(service.findAll().length).toBe(1); // Ensure cat is added to the service
  });

  it('should find all cats', () => {
    service.create({ name: 'Tom', age: 3, breed: 'Siamese' });
    service.create({ name: 'Jerry', age: 2, breed: 'Persian' });
    const cats = service.findAll();
    expect(cats.length).toBe(2);
  });

  it('should find a cat by string ID', () => {
    const createCatDto: CreateCatDto = {
      name: 'Tom',
      age: 3,
      breed: 'Siamese',
    };
    const cat = service.create(createCatDto);
    const foundCat = service.findOne(cat.id); // Use string ID
    expect(foundCat).toEqual(cat);
  });

  it('should throw NotFoundException when finding a cat with a non-existent ID', () => {
    expect(() => service.findOne('non-existent-id')).toThrow(NotFoundException);
  });

  it('should update a cat', () => {
    const createCatDto: CreateCatDto = {
      name: 'Tom',
      age: 3,
      breed: 'Siamese',
    };
    const cat = service.create(createCatDto);
    const updateCatDto: UpdateCatDto = { id: '1', name: 'Tommy' };
    const updatedCat = service.update(cat.id, updateCatDto); // Use string ID
    expect(updatedCat.name).toBe('Tommy');
    expect(updatedCat.id).toBe(cat.id); // Ensure ID remains the same
  });

  it('should throw NotFoundException when updating a cat with a non-existent ID', () => {
    const updateCatDto: UpdateCatDto = { id: '1', name: 'Tommy' };
    expect(() => service.update('non-existent-id', updateCatDto)).toThrow(
      NotFoundException,
    );
  });

  it('should remove a cat', () => {
    const createCatDto: CreateCatDto = {
      name: 'Tom',
      age: 3,
      breed: 'Siamese',
    };
    const cat = service.create(createCatDto);
    const removedCat = service.remove(cat.id); // Use string ID
    expect(removedCat).toEqual(cat);
    expect(() => service.findOne(cat.id)).toThrow(NotFoundException); // Ensure cat is removed
  });

  it('should throw NotFoundException when removing a cat with a non-existent ID', () => {
    expect(() => service.remove('non-existent-id')).toThrow(NotFoundException);
  });
});
