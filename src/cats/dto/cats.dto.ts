// cats.dto.ts

// DTO for creating a cat
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// DTO for updating a cat
export class UpdateCatDto {
  id: string;
  name?: string; // Optional properties
  age?: number;
  breed?: string;
}

// DTO for filtering cats (e.g., in a query)
export class FilterCatsDto {
  breed?: string;
  ageMin?: number;
  ageMax?: number;
}

export class ListAllEntities {
  limit?: number;
  page?: number;
}
