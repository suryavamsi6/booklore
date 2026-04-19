import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {map, Observable} from 'rxjs';
import {BookService} from '../../../book/service/book.service';

interface GenreRow {
  name: string;
  count: number;
  pct: number;
}

@Component({
  selector: 'app-dashboard-top-genres',
  templateUrl: './dashboard-top-genres.component.html',
  styleUrls: ['./dashboard-top-genres.component.scss'],
  imports: [AsyncPipe],
  standalone: true
})
export class DashboardTopGenresComponent implements OnInit {

  private bookService = inject(BookService);

  genres$!: Observable<GenreRow[]>;

  ngOnInit(): void {
    this.genres$ = this.bookService.bookState$.pipe(
      map(state => {
        const counts = new Map<string, number>();
        (state.books || []).forEach(b => {
          (b.metadata?.categories || []).forEach(cat => {
            counts.set(cat, (counts.get(cat) ?? 0) + 1);
          });
        });

        const sorted = [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        const max = sorted[0]?.[1] ?? 1;
        return sorted.map(([name, count]) => ({
          name,
          count,
          pct: Math.round((count / max) * 100)
        }));
      })
    );
  }
}
