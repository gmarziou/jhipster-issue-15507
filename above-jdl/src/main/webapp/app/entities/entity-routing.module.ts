import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'myApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'origin',
        data: { pageTitle: 'myApp.origin.home.title' },
        loadChildren: () => import('./origin/origin.module').then(m => m.OriginModule),
      },
      {
        path: 'rating',
        data: { pageTitle: 'myApp.rating.home.title' },
        loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
      },
      {
        path: 'movie',
        data: { pageTitle: 'myApp.movie.home.title' },
        loadChildren: () => import('./movie/movie.module').then(m => m.MovieModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'myApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'myApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'car',
        data: { pageTitle: 'myApp.car.home.title' },
        loadChildren: () => import('./car/car.module').then(m => m.CarModule),
      },
      {
        path: 'owner',
        data: { pageTitle: 'myApp.owner.home.title' },
        loadChildren: () => import('./owner/owner.module').then(m => m.OwnerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
