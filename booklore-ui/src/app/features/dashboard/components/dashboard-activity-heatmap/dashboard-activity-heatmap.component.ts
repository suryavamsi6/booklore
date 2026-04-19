import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {map, Observable} from 'rxjs';
import {BookService} from '../../../book/service/book.service';

interface HeatDay {
  date: Date;
  level: number; // 0–4
  label: string;
}

@Component({
  selector: 'app-dashboard-activity-heatmap',
  templateUrl: './dashboard-activity-heatmap.component.html',
  styleUrls: ['./dashboard-activity-heatmap.component.scss'],
  imports: [AsyncPipe],
  standalone: true
})
export class DashboardActivityHeatmapComponent implements OnInit {

  private bookService = inject(BookService);

  days$!: Observable<HeatDay[]>;

  ngOnInit(): void {
    this.days$ = this.bookService.bookState$.pipe(
      map(state => {
        const books = state.books || [];
        const readDates = new Set<string>();

        books.forEach(b => {
          const t = b.lastReadTime;
          if (t) readDates.add(t.slice(0, 10));
        });

        const today = new Date();
        const days: HeatDay[] = [];

        for (let i = 27; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          days.push({
            date: d,
            level: readDates.has(key) ? this.randomLevel() : 0,
            label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          });
        }
        return days;
      })
    );
  }

  private randomLevel(): number {
    return Math.ceil(Math.random() * 4);
  }
}
