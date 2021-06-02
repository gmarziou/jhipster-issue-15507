import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMovie, Movie } from '../movie.model';
import { MovieService } from '../service/movie.service';

@Component({
  selector: 'jhi-movie-update',
  templateUrl: './movie-update.component.html',
})
export class MovieUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected movieService: MovieService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movie }) => {
      this.updateForm(movie);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const movie = this.createFromForm();
    if (movie.id !== undefined) {
      this.subscribeToSaveResponse(this.movieService.update(movie));
    } else {
      this.subscribeToSaveResponse(this.movieService.create(movie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMovie>>): void {
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

  protected updateForm(movie: IMovie): void {
    this.editForm.patchValue({
      id: movie.id,
      name: movie.name,
    });
  }

  protected createFromForm(): IMovie {
    return {
      ...new Movie(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
