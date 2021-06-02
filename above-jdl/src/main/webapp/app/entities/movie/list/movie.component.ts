import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';
import { MovieDeleteDialogComponent } from '../delete/movie-delete-dialog.component';

@Component({
  selector: 'jhi-movie',
  templateUrl: './movie.component.html',
})
export class MovieComponent implements OnInit {
  movies?: IMovie[];
  isLoading = false;

  constructor(protected movieService: MovieService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.movieService.query().subscribe(
      (res: HttpResponse<IMovie[]>) => {
        this.isLoading = false;
        this.movies = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMovie): number {
    return item.id!;
  }

  delete(movie: IMovie): void {
    const modalRef = this.modalService.open(MovieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.movie = movie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
