import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';

@Component({
  templateUrl: './movie-delete-dialog.component.html',
})
export class MovieDeleteDialogComponent {
  movie?: IMovie;

  constructor(protected movieService: MovieService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.movieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
