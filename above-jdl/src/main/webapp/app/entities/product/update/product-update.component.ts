import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { IOrigin } from 'app/entities/origin/origin.model';
import { OriginService } from 'app/entities/origin/service/origin.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  originsCollection: IOrigin[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    origin: [],
  });

  constructor(
    protected productService: ProductService,
    protected originService: OriginService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackOriginById(index: number, item: IOrigin): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      origin: product.origin,
    });

    this.originsCollection = this.originService.addOriginToCollectionIfMissing(this.originsCollection, product.origin);
  }

  protected loadRelationshipsOptions(): void {
    this.originService
      .query({ filter: 'product-is-null' })
      .pipe(map((res: HttpResponse<IOrigin[]>) => res.body ?? []))
      .pipe(map((origins: IOrigin[]) => this.originService.addOriginToCollectionIfMissing(origins, this.editForm.get('origin')!.value)))
      .subscribe((origins: IOrigin[]) => (this.originsCollection = origins));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      origin: this.editForm.get(['origin'])!.value,
    };
  }
}
