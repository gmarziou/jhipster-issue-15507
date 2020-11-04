import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs';

import { MetricsService, Metrics, MetricsKey, Thread } from './metrics.service';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent implements OnInit {
  metrics?: Metrics;
  threads?: Thread[];
  updatingMetrics = true;

  constructor(private metricsService: MetricsService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.updatingMetrics = true;
    combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics = metrics;
      this.threads = threadDump.threads;
      this.updatingMetrics = false;
      this.changeDetector.detectChanges();
    });
  }

  metricsKeyExists(key: MetricsKey): boolean {
    return Boolean(this.metrics?.[key]);
  }

  metricsKeyExistsAndObjectNotEmpty(key: MetricsKey): boolean {
    return this.metrics?.[key] && JSON.stringify(this.metrics[key]) !== '{}';
  }
}
