import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { OriginComponent } from './list/origin.component';
import { OriginDetailComponent } from './detail/origin-detail.component';
import { OriginUpdateComponent } from './update/origin-update.component';
import { OriginDeleteDialogComponent } from './delete/origin-delete-dialog.component';
import { OriginRoutingModule } from './route/origin-routing.module';

@NgModule({
  imports: [SharedModule, OriginRoutingModule],
  declarations: [OriginComponent, OriginDetailComponent, OriginUpdateComponent, OriginDeleteDialogComponent],
  entryComponents: [OriginDeleteDialogComponent],
})
export class OriginModule {}
