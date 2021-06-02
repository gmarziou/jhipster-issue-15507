import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRating, Rating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { IMovie } from 'app/entities/movie/movie.model';
import { MovieService } from 'app/entities/movie/service/movie.service';

@Component({
  selector: 'jhi-rating-update',
  templateUrl: './rating-update.component.html',
})
export class RatingUpdateComponent implements OnInit {
  isSaving = false;

  moviesSharedCollection: IMovie[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    movie: [],
  });

  constructor(
    protected ratingService: RatingService,
    protected movieService: MovieService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rating }) => {
      this.updateForm(rating);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rating = this.createFromForm();
    if (rating.id !== undefined) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  trackMovieById(index: number, item: IMovie): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rating: IRating): void {
    this.editForm.patchValue({
      id: rating.id,
      name: rating.name,
      movie: rating.movie,
    });

    this.moviesSharedCollection = this.movieService.addMovieToCollectionIfMissing(this.moviesSharedCollection, rating.movie);
  }

  protected loadRelationshipsOptions(): void {
    this.movieService
      .query()
      .pipe(map((res: HttpResponse<IMovie[]>) => res.body ?? []))
      .pipe(map((movies: IMovie[]) => this.movieService.addMovieToCollectionIfMissing(movies, this.editForm.get('movie')!.value)))
      .subscribe((movies: IMovie[]) => (this.moviesSharedCollection = movies));
  }

  protected createFromForm(): IRating {
    return {
      ...new Rating(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      movie: this.editForm.get(['movie'])!.value,
    };
  }
}
