import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MovieComponent } from './list/movie.component';
import { MovieDetailComponent } from './detail/movie-detail.component';
import { MovieUpdateComponent } from './update/movie-update.component';
import { MovieDeleteDialogComponent } from './delete/movie-delete-dialog.component';
import { MovieRoutingModule } from './route/movie-routing.module';

@NgModule({
  imports: [SharedModule, MovieRoutingModule],
  declarations: [MovieComponent, MovieDetailComponent, MovieUpdateComponent, MovieDeleteDialogComponent],
  entryComponents: [MovieDeleteDialogComponent],
})
export class MovieModule {}
