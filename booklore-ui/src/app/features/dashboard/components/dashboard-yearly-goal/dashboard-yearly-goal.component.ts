import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {map, Observable} from 'rxjs';
import {BookService} from '../../../book/service/book.service';
import {ReadStatus} from '../../../book/model/book.model';

interface GoalVm {
  finished: number;
  goal: number;
  pct: number;
  circumference: number;
  dashOffset: number;
}

@Component({
  selector: 'app-dashboard-yearly-goal',
  templateUrl: './dashboard-yearly-goal.component.html',
  styleUrls: ['./dashboard-yearly-goal.component.scss'],
  imports: [AsyncPipe],
  standalone: true
})
export class DashboardYearlyGoalComponent implements OnInit {

  private bookService = inject(BookService);

  vm$!: Observable<GoalVm>;

  private readonly GOAL = 52;
  private readonly R = 36;

  ngOnInit(): void {
    const circumference = 2 * Math.PI * this.R;
    const goal = this.GOAL;
    const r = this.R;

    this.vm$ = this.bookService.bookState$.pipe(
      map(state => {
        const year = new Date().getFullYear();
        const finished = (state.books || []).filter(b =>
          b.readStatus === ReadStatus.READ && b.dateFinished?.startsWith(String(year))
        ).length;

        const pct = Math.min(100, Math.round((finished / goal) * 100));
        const dashOffset = circumference * (1 - pct / 100);

        return { finished, goal, pct, circumference, dashOffset };
      })
    );
  }
}
