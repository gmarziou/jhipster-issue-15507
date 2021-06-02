import { IRating } from 'app/entities/rating/rating.model';

export interface IMovie {
  id?: number;
  name?: string | null;
  ratings?: IRating[] | null;
}

export class Movie implements IMovie {
  constructor(public id?: number, public name?: string | null, public ratings?: IRating[] | null) {}
}

export function getMovieIdentifier(movie: IMovie): number | undefined {
  return movie.id;
}
