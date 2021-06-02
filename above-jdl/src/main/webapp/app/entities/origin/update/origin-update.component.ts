import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IOrigin, Origin } from '../origin.model';
import { OriginService } from '../service/origin.service';

@Component({
  selector: 'jhi-origin-update',
  templateUrl: './origin-update.component.html',
})
export class OriginUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected originService: OriginService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ origin }) => {
      this.updateForm(origin);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const origin = this.createFromForm();
    if (origin.id !== undefined) {
      this.subscribeToSaveResponse(this.originService.update(origin));
    } else {
      this.subscribeToSaveResponse(this.originService.create(origin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrigin>>): void {
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

  protected updateForm(origin: IOrigin): void {
    this.editForm.patchValue({
      id: origin.id,
      name: origin.name,
    });
  }

  protected createFromForm(): IOrigin {
    return {
      ...new Origin(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
