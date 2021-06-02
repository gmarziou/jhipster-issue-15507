import { IMovie } from 'app/entities/movie/movie.model';

export interface IRating {
  id?: number;
  name?: string | null;
  movie?: IMovie | null;
}

export class Rating implements IRating {
  constructor(public id?: number, public name?: string | null, public movie?: IMovie | null) {}
}

export function getRatingIdentifier(rating: IRating): number | undefined {
  return rating.id;
}
