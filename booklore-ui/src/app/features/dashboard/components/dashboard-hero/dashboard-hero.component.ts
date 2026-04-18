import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {TranslocoDirective} from '@jsverse/transloco';
import {Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Book, ReadStatus} from '../../../book/model/book.model';
import {BookService} from '../../../book/service/book.service';
import {UserService} from '../../../settings/user-management/user.service';
import {UrlHelperService} from '../../../../shared/service/url-helper.service';
import {BookState} from '../../../book/model/state/book-state.model';

interface HeroVm {
  greetingKey: string;
  userName: string;
  current: Book | null;
  coverUrl: string | null;
  progress: number;
  stats: {
    totalBooks: number;
    inProgress: number;
    unread: number;
    finishedThisYear: number;
  };
}

@Component({
  selector: 'app-dashboard-hero',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, TranslocoDirective],
  templateUrl: './dashboard-hero.component.html',
  styleUrl: './dashboard-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeroComponent implements OnInit {
  private bookService = inject(BookService);
  private userService = inject(UserService);
  private urlHelper = inject(UrlHelperService);
  private router = inject(Router);

  vm$!: Observable<HeroVm>;

  ngOnInit(): void {
    this.vm$ = combineLatest([this.bookService.bookState$, this.userService.userState$]).pipe(
      map(([bookState, userState]) => this.buildVm(bookState, userState.user?.name || userState.user?.username || '')),
      shareReplay(1)
    );
  }

  private buildVm(state: BookState, userName: string): HeroVm {
    const books = state.books || [];
    const reading = books
      .filter(b => b.lastReadTime && this.hasProgress(b) &&
        (b.readStatus === ReadStatus.READING || b.readStatus === ReadStatus.RE_READING || b.readStatus === ReadStatus.PAUSED))
      .sort((a, b) => new Date(b.lastReadTime!).getTime() - new Date(a.lastReadTime!).getTime());
    const current = reading[0] || null;
    const year = new Date().getFullYear();
    const finishedThisYear = books.filter(b => b.readStatus === ReadStatus.READ && b.dateFinished &&
      new Date(b.dateFinished).getFullYear() === year).length;
    const unread = books.filter(b => !b.readStatus || b.readStatus === ReadStatus.UNREAD).length;
    const inProgress = reading.length;
    return {
      greetingKey: this.greetingKeyFor(new Date()),
      userName,
      current,
      coverUrl: current ? this.urlHelper.getThumbnailUrl(current.id, current.metadata?.coverUpdatedOn) : null,
      progress: current ? this.progressPercent(current) : 0,
      stats: {
        totalBooks: books.length,
        inProgress,
        unread,
        finishedThisYear,
      },
    };
  }

  private hasProgress(book: Book): boolean {
    return !!(book.epubProgress || book.pdfProgress || book.cbxProgress || book.audiobookProgress ||
      book.koreaderProgress || book.koboProgress);
  }

  private progressPercent(book: Book): number {
    const p = book.epubProgress?.percentage ?? book.pdfProgress?.percentage ??
      book.cbxProgress?.percentage ?? book.audiobookProgress?.percentage ??
      book.koreaderProgress?.percentage ?? book.koboProgress?.percentage ?? 0;
    return Math.round(p);
  }

  private greetingKeyFor(d: Date): string {
    const h = d.getHours();
    if (h < 5) return 'greetingNight';
    if (h < 12) return 'greetingMorning';
    if (h < 17) return 'greetingAfternoon';
    if (h < 22) return 'greetingEvening';
    return 'greetingNight';
  }

  resume(book: Book | null): void {
    if (!book) return;
    this.router.navigate(['/book', book.id]);
  }

  openLibrary(): void {
    this.router.navigate(['/all-books']);
  }
}
