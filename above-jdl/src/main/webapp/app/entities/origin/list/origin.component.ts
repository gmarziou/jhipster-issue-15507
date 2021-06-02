import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrigin } from '../origin.model';
import { OriginService } from '../service/origin.service';
import { OriginDeleteDialogComponent } from '../delete/origin-delete-dialog.component';

@Component({
  selector: 'jhi-origin',
  templateUrl: './origin.component.html',
})
export class OriginComponent implements OnInit {
  origins?: IOrigin[];
  isLoading = false;

  constructor(protected originService: OriginService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.originService.query().subscribe(
      (res: HttpResponse<IOrigin[]>) => {
        this.isLoading = false;
        this.origins = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOrigin): number {
    return item.id!;
  }

  delete(origin: IOrigin): void {
    const modalRef = this.modalService.open(OriginDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.origin = origin;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
