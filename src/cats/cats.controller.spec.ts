import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto, UpdateCatDto } from './dto/cats.dto';
import { Cat } from './interfaces/cat.interface';
import { NotFoundException } from '@nestjs/common';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cat', () => {
      const createCatDto: CreateCatDto = {
        name: 'Tom',
        age: 3,
        breed: 'Siamese',
      };
      const newCat: Cat = { id: '1', ...createCatDto }; // Mocking the expected output
      jest.spyOn(service, 'create').mockReturnValue(newCat);

      expect(controller.create(createCatDto)).toEqual(newCat);
      expect(service.create).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const cats: Cat[] = [
        { id: '1', name: 'Tom', age: 3, breed: 'Siamese' },
        { id: '2', name: 'Jerry', age: 2, breed: 'Persian' },
      ];
      jest.spyOn(service, 'findAll').mockReturnValue(cats);

      expect(controller.findAll({ limit: 2 })).toEqual(cats);
      expect(service.findAll).toHaveBeenCalledWith(2);
    });
  });

  describe('findOne', () => {
    it('should return a cat by ID', () => {
      const cat: Cat = { id: '1', name: 'Tom', age: 3, breed: 'Siamese' };
      jest.spyOn(service, 'findOne').mockReturnValue(cat);

      expect(controller.findOne('1')).toEqual(cat);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when cat is not found', () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.findOne('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a cat', () => {
      const cat: Cat = { id: '1', name: 'Tom', age: 3, breed: 'Siamese' };
      const updateCatDto: UpdateCatDto = { id: '1', name: 'Tommy' };
      jest
        .spyOn(service, 'update')
        .mockReturnValue({ ...cat, ...updateCatDto });

      expect(controller.update('1', updateCatDto)).toEqual({
        ...cat,
        ...updateCatDto,
      });
      expect(service.update).toHaveBeenCalledWith('1', updateCatDto);
    });

    it('should throw NotFoundException when updating a non-existent cat', () => {
      const updateCatDto: UpdateCatDto = { id: '1', name: 'Tommy' };
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.update('non-existent-id', updateCatDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a cat', () => {
      const cat: Cat = { id: '1', name: 'Tom', age: 3, breed: 'Siamese' };
      jest.spyOn(service, 'remove').mockReturnValue(cat);

      expect(controller.remove('1')).toEqual(cat);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when removing a non-existent cat', () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(() => controller.remove('non-existent-id')).toThrow(
        NotFoundException,
      );
    });
  });
});
