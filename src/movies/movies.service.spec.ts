import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    beforeEach(() =>
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      }),
    );
    it('should return a movie', () => {
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toBe(1);
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Movie with ID: 999 not found.');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreateLength = service.getAll().length;
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const afterCreateLength = service.getAll().length;
      expect(afterCreateLength).toBeGreaterThan(beforeCreateLength);
    });
  });

  describe('deleteOne', () => {
    beforeEach(() =>
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      }),
    );
    it('deletes a movie', () => {
      const beforeDeleteLength = service.getAll().length;
      service.deleteOne(1);
      const afterDeleteLength = service.getAll().length;

      expect(afterDeleteLength).toBeLessThan(beforeDeleteLength);
    });
    it('should return a 404', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      service.update(1, { title: 'Updated Test' });
      const movie = service.getOne(1);
      expect(movie.title).toBe('Updated Test');
    });
    it('should return a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
