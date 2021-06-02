import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MovieComponent } from '../list/movie.component';
import { MovieDetailComponent } from '../detail/movie-detail.component';
import { MovieUpdateComponent } from '../update/movie-update.component';
import { MovieRoutingResolveService } from './movie-routing-resolve.service';

const movieRoute: Routes = [
  {
    path: '',
    component: MovieComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MovieDetailComponent,
    resolve: {
      movie: MovieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MovieUpdateComponent,
    resolve: {
      movie: MovieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MovieUpdateComponent,
    resolve: {
      movie: MovieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(movieRoute)],
  exports: [RouterModule],
})
export class MovieRoutingModule {}
