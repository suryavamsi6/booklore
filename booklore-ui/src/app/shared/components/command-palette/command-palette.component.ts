import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {CommandPaletteService} from './command-palette.service';
import {BookService} from '../../../features/book/service/book.service';
import {Book} from '../../../features/book/model/book.model';
import {UrlHelperService} from '../../service/url-helper.service';

interface PageEntry {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const PAGES: PageEntry[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
  { id: 'library', label: 'All Books', icon: 'pi pi-book', route: '/all-books' },
  { id: 'series', label: 'Series', icon: 'pi pi-list', route: '/series' },
  { id: 'authors', label: 'Authors', icon: 'pi pi-user', route: '/authors' },
  { id: 'upload', label: 'Upload Books', icon: 'pi pi-upload', route: '/upload' },
  { id: 'settings', label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
];

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.scss'],
  imports: [AsyncPipe, FormsModule],
  standalone: true
})
export class CommandPaletteComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private paletteService = inject(CommandPaletteService);
  private bookService = inject(BookService);
  private router = inject(Router);
  protected urlHelper = inject(UrlHelperService);

  isOpen$ = this.paletteService.open$;

  query = '';
  activeIndex = 0;
  books: Book[] = [];
  pages: PageEntry[] = PAGES;

  get filteredBooks(): Book[] {
    if (!this.query.trim()) return this.books.slice(0, 6);
    const q = this.query.toLowerCase();
    return this.books
      .filter(b =>
        b.metadata?.title?.toLowerCase().includes(q) ||
        b.metadata?.authors?.some(a => a.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }

  get filteredPages(): PageEntry[] {
    if (!this.query.trim()) return this.pages;
    const q = this.query.toLowerCase();
    return this.pages.filter(p => p.label.toLowerCase().includes(q));
  }

  get allResults(): number {
    return this.filteredBooks.length + this.filteredPages.length;
  }

  ngOnInit(): void {
    this.bookService.bookState$.pipe(
      map(state => state.books || [])
    ).subscribe(books => this.books = books);
  }

  open(): void {
    this.query = '';
    this.activeIndex = 0;
    setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
  }

  close(): void {
    this.paletteService.close();
  }

  selectBook(book: Book): void {
    this.close();
    this.router.navigate(['/book', book.id], { queryParams: { tab: 'view' } });
  }

  selectPage(page: PageEntry): void {
    this.close();
    this.router.navigate([page.route]);
  }

  coverUrl(book: Book): string {
    return this.urlHelper.getThumbnailUrl(book.id, book.metadata?.coverUpdatedOn);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.paletteService.toggle();
      if (this.paletteService['_open$'].getValue()) this.open();
      return;
    }
    if (!this.paletteService['_open$'].getValue()) return;

    if (e.key === 'Escape') { this.close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); this.activeIndex = Math.min(this.activeIndex + 1, this.allResults - 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); this.activeIndex = Math.max(this.activeIndex - 1, 0); }
    if (e.key === 'Enter') {
      const bookCount = this.filteredBooks.length;
      if (this.activeIndex < bookCount) {
        this.selectBook(this.filteredBooks[this.activeIndex]);
      } else {
        this.selectPage(this.filteredPages[this.activeIndex - bookCount]);
      }
    }
  }
}
