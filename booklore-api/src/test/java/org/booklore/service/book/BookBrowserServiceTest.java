package org.booklore.service.book;

import org.booklore.config.security.service.AuthenticationService;
import org.booklore.model.dto.Book;
import org.booklore.model.dto.BookFile;
import org.booklore.model.dto.BookLoreUser;
import org.booklore.model.dto.BookMetadata;
import org.booklore.model.dto.BookBrowserScope;
import org.booklore.model.dto.PagedResponse;
import org.booklore.model.dto.Shelf;
import org.booklore.model.dto.request.BookBrowserQueryRequest;
import org.booklore.model.dto.request.BookBrowserSortCriterion;
import org.booklore.model.dto.response.BookBrowserFacetsResponse;
import org.booklore.model.enums.BookFileType;
import org.booklore.model.dto.progress.EpubProgress;
import org.booklore.model.dto.progress.KoboProgress;
import org.booklore.service.opds.MagicShelfBookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookBrowserServiceTest {

    @Mock
    private BookService bookService;
    @Mock
    private AuthenticationService authenticationService;
    @Mock
    private MagicShelfBookService magicShelfBookService;

    @InjectMocks
    private BookBrowserService service;

    private Book duneOne;
    private Book duneTwo;
    private Book cSharp;

    @BeforeEach
    void setUp() {
        duneOne = Book.builder()
                .id(1L)
                .libraryId(10L)
                .libraryName("Main")
                .fileName("Dune 1.epub")
                .filePath("/books/dune1.epub")
                .fileSizeKb(1500L)
                .primaryFile(BookFile.builder().fileName("Dune 1.epub").bookType(BookFileType.EPUB).fileSizeKb(1500L).build())
                .metadata(BookMetadata.builder()
                        .title("Dune")
                        .authors(List.of("Frank Herbert"))
                        .seriesName("Dune Saga")
                        .seriesNumber(1.0f)
                        .publishedDate(LocalDate.of(1965, 8, 1))
                        .language("en")
                        .build())
                .addedOn(Instant.parse("2024-01-02T00:00:00Z"))
                .epubProgress(EpubProgress.builder().cfi("cfi").percentage(0.25f).build())
                .koboProgress(KoboProgress.builder().percentage(0.80f).build())
                .shelves(Set.of(Shelf.builder().id(100L).name("Favorites").userId(5L).build()))
                .build();

        duneTwo = Book.builder()
                .id(2L)
                .libraryId(10L)
                .libraryName("Main")
                .fileName("Dune 2.epub")
                .filePath("/books/dune2.epub")
                .fileSizeKb(1800L)
                .primaryFile(BookFile.builder().fileName("Dune 2.epub").bookType(BookFileType.EPUB).fileSizeKb(1800L).build())
                .metadata(BookMetadata.builder()
                        .title("Dune Messiah")
                        .authors(List.of("Frank Herbert"))
                        .seriesName("Dune Saga")
                        .seriesNumber(2.0f)
                        .publishedDate(LocalDate.of(1969, 1, 1))
                        .language("en")
                        .build())
                .addedOn(Instant.parse("2024-01-03T00:00:00Z"))
                .epubProgress(EpubProgress.builder().cfi("cfi").percentage(0.60f).build())
                .build();

        cSharp = Book.builder()
                .id(3L)
                .libraryId(11L)
                .libraryName("Tech")
                .fileName("C# in Depth.pdf")
                .filePath("/books/csharp.pdf")
                .fileSizeKb(2500L)
                .primaryFile(BookFile.builder().fileName("C# in Depth.pdf").bookType(BookFileType.PDF).fileSizeKb(2500L).build())
                .metadata(BookMetadata.builder()
                        .title("C# in Depth")
                        .authors(List.of("Jon Skeet"))
                        .publishedDate(LocalDate.of(2019, 3, 23))
                        .language("en")
                        .build())
                .addedOn(Instant.parse("2024-01-01T00:00:00Z"))
                .build();
    }

    @Test
    void queryBooks_seriesCollapsedWithoutSeriesFilter_returnsCollapsedSeriesBook() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne, duneTwo, cSharp));

        PagedResponse<Book> response = service.queryBooks(BookBrowserQueryRequest.builder()
                .scope(BookBrowserScope.ALL_BOOKS)
                .seriesCollapsed(true)
                .sortField("title")
                .sortDirection("ASCENDING")
                .build());

        assertEquals(2, response.getContent().size());
        Book collapsedSeries = response.getContent().stream()
                .filter(book -> book.getSeriesCount() != null)
                .findFirst()
                .orElseThrow();
        assertEquals(2, collapsedSeries.getSeriesCount());
        assertEquals(2, collapsedSeries.getSeriesBooks().size());
        assertEquals("Dune", collapsedSeries.getMetadata().getTitle());
    }

    @Test
    void queryBooks_withSeriesFilter_forceExpandsSeries() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne, duneTwo, cSharp));

        PagedResponse<Book> response = service.queryBooks(BookBrowserQueryRequest.builder()
                .scope(BookBrowserScope.ALL_BOOKS)
                .seriesCollapsed(true)
                .filters(Map.of("series", List.of("Dune Saga")))
                .filterMode("and")
                .sortField("seriesNumber")
                .sortDirection("ASCENDING")
                .build());

        assertEquals(2, response.getContent().size());
        assertIterableEquals(List.of(1L, 2L), response.getContent().stream().map(Book::getId).toList());
    }

    @Test
    void queryBooks_singleFilterMode_keepsOnlyOneSelection() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne, duneTwo, cSharp));

        PagedResponse<Book> response = service.queryBooks(BookBrowserQueryRequest.builder()
                .filters(Map.of("author", List.of("Jon Skeet")))
                .filterMode("single")
                .build());

        assertEquals(1, response.getContent().size());
        assertEquals(3L, response.getContent().getFirst().getId());
    }

    @Test
    void queryBooks_multiSortAndReadingProgressMatchFrontendOrder() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne, duneTwo, cSharp));

        PagedResponse<Book> response = service.queryBooks(BookBrowserQueryRequest.builder()
                .sortCriteria(List.of(
                        BookBrowserSortCriterion.builder().field("readingProgress").direction("DESCENDING").build(),
                        BookBrowserSortCriterion.builder().field("title").direction("ASCENDING").build()
                ))
                .build());

        assertIterableEquals(List.of(3L, 2L, 1L), response.getContent().stream().map(Book::getId).toList());
    }

    @Test
    void getFacets_returnsPublishedYearAndShelfStatusCounts() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne, duneTwo, cSharp));

        BookBrowserFacetsResponse response = service.getFacets(BookBrowserQueryRequest.builder().build());

        assertNotNull(response.getFacets());
        assertEquals(3, response.getFacets().get("publishedDate").size());
        assertEquals(1L, response.getFacets().get("shelfStatus").stream()
                .filter(value -> "shelved".equals(value.getValue().getId()))
                .findFirst()
                .orElseThrow()
                .getBookCount());
    }

    @Test
    void queryBooks_nonMagicShelfScope_doesNotTouchMagicShelfService() {
        when(bookService.getBookDTOs(false)).thenReturn(List.of(duneOne));

        service.queryBooks(BookBrowserQueryRequest.builder().scope(BookBrowserScope.ALL_BOOKS).build());

        verifyNoInteractions(authenticationService, magicShelfBookService);
    }
}
