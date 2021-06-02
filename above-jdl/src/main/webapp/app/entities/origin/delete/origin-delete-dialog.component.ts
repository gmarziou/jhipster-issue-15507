import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrigin } from '../origin.model';
import { OriginService } from '../service/origin.service';

@Component({
  templateUrl: './origin-delete-dialog.component.html',
})
export class OriginDeleteDialogComponent {
  origin?: IOrigin;

  constructor(protected originService: OriginService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.originService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
