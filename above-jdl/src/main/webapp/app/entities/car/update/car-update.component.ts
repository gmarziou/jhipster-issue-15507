import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICar, Car } from '../car.model';
import { CarService } from '../service/car.service';
import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';

@Component({
  selector: 'jhi-car-update',
  templateUrl: './car-update.component.html',
})
export class CarUpdateComponent implements OnInit {
  isSaving = false;

  ownersSharedCollection: IOwner[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    owners: [],
  });

  constructor(
    protected carService: CarService,
    protected ownerService: OwnerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ car }) => {
      this.updateForm(car);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const car = this.createFromForm();
    if (car.id !== undefined) {
      this.subscribeToSaveResponse(this.carService.update(car));
    } else {
      this.subscribeToSaveResponse(this.carService.create(car));
    }
  }

  trackOwnerById(index: number, item: IOwner): number {
    return item.id!;
  }

  getSelectedOwner(option: IOwner, selectedVals?: IOwner[]): IOwner {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICar>>): void {
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

  protected updateForm(car: ICar): void {
    this.editForm.patchValue({
      id: car.id,
      name: car.name,
      owners: car.owners,
    });

    this.ownersSharedCollection = this.ownerService.addOwnerToCollectionIfMissing(this.ownersSharedCollection, ...(car.owners ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.ownerService
      .query()
      .pipe(map((res: HttpResponse<IOwner[]>) => res.body ?? []))
      .pipe(
        map((owners: IOwner[]) => this.ownerService.addOwnerToCollectionIfMissing(owners, ...(this.editForm.get('owners')!.value ?? [])))
      )
      .subscribe((owners: IOwner[]) => (this.ownersSharedCollection = owners));
  }

  protected createFromForm(): ICar {
    return {
      ...new Car(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      owners: this.editForm.get(['owners'])!.value,
    };
  }
}
