package org.booklore.service.book;

import lombok.RequiredArgsConstructor;
import org.booklore.config.security.service.AuthenticationService;
import org.booklore.model.dto.Book;
import org.booklore.model.dto.BookBrowserScope;
import org.booklore.model.dto.BookMetadata;
import org.booklore.model.dto.PagedResponse;
import org.booklore.model.dto.Shelf;
import org.booklore.model.dto.request.BookBrowserQueryRequest;
import org.booklore.model.dto.request.BookBrowserSortCriterion;
import org.booklore.model.dto.response.BookBrowserFacetValue;
import org.booklore.model.dto.response.BookBrowserFacetsResponse;
import org.booklore.model.dto.response.BookBrowserFilterValue;
import org.booklore.model.dto.progress.AudiobookProgress;
import org.booklore.model.dto.progress.CbxProgress;
import org.booklore.model.dto.progress.EpubProgress;
import org.booklore.model.dto.progress.KoProgress;
import org.booklore.model.dto.progress.KoboProgress;
import org.booklore.model.dto.progress.PdfProgress;
import org.booklore.service.opds.MagicShelfBookService;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BookBrowserService {

    private static final int DEFAULT_PAGE_SIZE = 100;
    private static final int MAX_PAGE_SIZE = 200;
    private static final int MAX_FILTER_ITEMS = 100;
    private static final Pattern NATURAL_CHUNK_PATTERN = Pattern.compile("(\\d+|\\D+)");
    private static final Pattern COMBINING_MARKS_PATTERN = Pattern.compile("\\p{M}+");
    private static final Pattern PUNCTUATION_PATTERN = Pattern.compile("[!@$%^&*_=|~`<>?/\";']");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");

    private static final List<String> FILTER_TYPES = List.of(
            "author", "category", "series", "bookType", "readStatus",
            "personalRating", "publisher", "matchScore", "library", "shelf",
            "shelfStatus", "tag", "publishedDate", "fileSize", "amazonRating",
            "goodreadsRating", "hardcoverRating", "language", "pageCount", "mood",
            "ageRating", "contentRating", "narrator",
            "comicCharacter", "comicTeam", "comicLocation", "comicCreator"
    );

    private static final Set<String> SORT_INDEX_FILTERS = Set.of(
            "personalRating", "matchScore", "fileSize", "amazonRating",
            "goodreadsRating", "hardcoverRating", "pageCount", "ageRating"
    );

    private static final Map<String, String> READ_STATUS_LABELS = Map.ofEntries(
            Map.entry("UNREAD", "Unread"),
            Map.entry("READING", "Reading"),
            Map.entry("RE_READING", "Re-reading"),
            Map.entry("PARTIALLY_READ", "Partially Read"),
            Map.entry("PAUSED", "Paused"),
            Map.entry("READ", "Read"),
            Map.entry("WONT_READ", "Won't Read"),
            Map.entry("ABANDONED", "Abandoned"),
            Map.entry("UNSET", "Unset")
    );

    private static final Map<String, String> CONTENT_RATING_LABELS = Map.of(
            "EVERYONE", "Everyone",
            "TEEN", "Teen",
            "MATURE", "Mature",
            "ADULT", "Adult",
            "EXPLICIT", "Explicit"
    );

    private static final Map<String, String> COMIC_ROLE_LABELS = Map.of(
            "penciller", "Penciller",
            "inker", "Inker",
            "colorist", "Colorist",
            "letterer", "Letterer",
            "coverArtist", "Cover Artist",
            "editor", "Editor"
    );

    private static final Map<String, Integer> READ_STATUS_RANK = Map.ofEntries(
            Map.entry("UNSET", 0),
            Map.entry("UNREAD", 1),
            Map.entry("READING", 2),
            Map.entry("RE_READING", 3),
            Map.entry("PARTIALLY_READ", 4),
            Map.entry("PAUSED", 5),
            Map.entry("READ", 6),
            Map.entry("ABANDONED", 7),
            Map.entry("WONT_READ", 8)
    );

    private static final List<RangeOption> RATING_RANGES_5 = List.of(
            new RangeOption(0, "0 to 1", 0, 1, 0),
            new RangeOption(1, "1 to 2", 1, 2, 1),
            new RangeOption(2, "2 to 3", 2, 3, 2),
            new RangeOption(3, "3 to 4", 3, 4, 3),
            new RangeOption(4, "4 to 4.5", 4, 4.5, 4),
            new RangeOption(5, "4.5+", 4.5, Double.POSITIVE_INFINITY, 5)
    );

    private static final List<RangeOption> RATING_OPTIONS_10 = List.of(
            new RangeOption(1, "1", 1, 2, 0),
            new RangeOption(2, "2", 2, 3, 1),
            new RangeOption(3, "3", 3, 4, 2),
            new RangeOption(4, "4", 4, 5, 3),
            new RangeOption(5, "5", 5, 6, 4),
            new RangeOption(6, "6", 6, 7, 5),
            new RangeOption(7, "7", 7, 8, 6),
            new RangeOption(8, "8", 8, 9, 7),
            new RangeOption(9, "9", 9, 10, 8),
            new RangeOption(10, "10", 10, 11, 9)
    );

    private static final List<RangeOption> FILE_SIZE_RANGES = List.of(
            new RangeOption(0, "< 1 MB", 0, 1024, 0),
            new RangeOption(1, "1–10 MB", 1024, 10240, 1),
            new RangeOption(2, "10–50 MB", 10240, 51200, 2),
            new RangeOption(3, "50–100 MB", 51200, 102400, 3),
            new RangeOption(4, "250–500 MB", 256000, 512000, 4),
            new RangeOption(5, "0.5–1 GB", 512000, 1048576, 5),
            new RangeOption(6, "1–2 GB", 1048576, 2097152, 6),
            new RangeOption(7, "5+ GB", 5242880, Double.POSITIVE_INFINITY, 7)
    );

    private static final List<RangeOption> PAGE_COUNT_RANGES = List.of(
            new RangeOption(0, "< 50 pages", 0, 50, 0),
            new RangeOption(1, "50–100 pages", 50, 100, 1),
            new RangeOption(2, "100–200 pages", 100, 200, 2),
            new RangeOption(3, "200–400 pages", 200, 400, 3),
            new RangeOption(4, "400–600 pages", 400, 600, 4),
            new RangeOption(5, "600–1000 pages", 600, 1000, 5),
            new RangeOption(6, "1000+ pages", 1000, Double.POSITIVE_INFINITY, 6)
    );

    private static final List<RangeOption> MATCH_SCORE_RANGES = List.of(
            new RangeOption(0, "Outstanding (95–100%)", 0.95, 1.01, 0),
            new RangeOption(1, "Excellent (90–94%)", 0.90, 0.95, 1),
            new RangeOption(2, "Great (80–89%)", 0.80, 0.90, 2),
            new RangeOption(3, "Good (70–79%)", 0.70, 0.80, 3),
            new RangeOption(4, "Fair (50–69%)", 0.50, 0.70, 4),
            new RangeOption(5, "Weak (30–49%)", 0.30, 0.50, 5),
            new RangeOption(6, "Poor (0–29%)", 0.00, 0.30, 6)
    );

    private static final List<RangeOption> AGE_RATING_OPTIONS = List.of(
            new RangeOption(0, "All Ages", 0, 1, 0),
            new RangeOption(6, "6+", 6, 7, 1),
            new RangeOption(10, "10+", 10, 11, 2),
            new RangeOption(13, "13+", 13, 14, 3),
            new RangeOption(16, "16+", 16, 17, 4),
            new RangeOption(18, "18+", 18, 19, 5),
            new RangeOption(21, "21+", 21, 22, 6)
    );

    private final BookService bookService;
    private final AuthenticationService authenticationService;
    private final MagicShelfBookService magicShelfBookService;

    public PagedResponse<Book> queryBooks(BookBrowserQueryRequest request) {
        List<Book> scopedBooks = getScopedBooks(request);
        List<Book> searchedBooks = applySearch(scopedBooks, request.getSearchText());
        List<Book> filteredBooks = applyFilters(searchedBooks, request.getFilters(), request.getFilterMode(), null);
        List<Book> resultBooks = shouldCollapseSeries(request)
                ? applySeriesCollapse(filteredBooks)
                : filteredBooks;

        resultBooks = sortBooks(resultBooks, resolveSortCriteria(request), request.getRandomSeed());
        return paginate(resultBooks, request);
    }

    public BookBrowserFacetsResponse getFacets(BookBrowserQueryRequest request) {
        List<Book> scopedBooks = getScopedBooks(request);
        Map<String, List<BookBrowserFacetValue>> facets = new LinkedHashMap<>();

        for (String filterType : FILTER_TYPES) {
            List<Book> filteredBooks = applyFilters(scopedBooks, request.getFilters(), request.getFilterMode(), filterType);
            facets.put(filterType, buildFacetValues(filterType, filteredBooks));
        }

        return BookBrowserFacetsResponse.builder()
                .facets(facets)
                .build();
    }

    private List<Book> getScopedBooks(BookBrowserQueryRequest request) {
        List<Book> books = bookService.getBookDTOs(false);
        BookBrowserScope scope = request.getScope() == null ? BookBrowserScope.ALL_BOOKS : request.getScope();

        return switch (scope) {
            case ALL_BOOKS -> books;
            case LIBRARY -> books.stream()
                    .filter(book -> Objects.equals(book.getLibraryId(), requireValue(request.getLibraryId(), "libraryId")))
                    .toList();
            case SHELF -> {
                Long shelfId = requireValue(request.getShelfId(), "shelfId");
                yield books.stream()
                        .filter(book -> hasShelf(book, shelfId))
                        .toList();
            }
            case UNSHELVED -> books.stream()
                    .filter(this::isUnshelved)
                    .toList();
            case MAGIC_SHELF -> {
                Long userId = authenticationService.getAuthenticatedUser().getId();
                Long magicShelfId = requireValue(request.getMagicShelfId(), "magicShelfId");
                Set<Long> bookIds = new HashSet<>(magicShelfBookService.getBookIdsByMagicShelfId(userId, magicShelfId, Math.max(books.size(), 1)));
                yield books.stream()
                        .filter(book -> bookIds.contains(book.getId()))
                        .toList();
            }
        };
    }

    private List<Book> applySearch(List<Book> books, String searchText) {
        if (searchText == null) {
            return books;
        }

        String normalizedTerm = normalizeForSearch(searchText).trim();
        if (normalizedTerm.length() < 2) {
            return books;
        }

        return books.stream()
                .filter(book -> matchesSearch(book, normalizedTerm))
                .toList();
    }

    private boolean matchesSearch(Book book, String normalizedTerm) {
        BookMetadata metadata = book.getMetadata();
        List<String> authors = metadata != null && metadata.getAuthors() != null ? metadata.getAuthors() : List.of();
        Set<String> categories = metadata != null && metadata.getCategories() != null ? metadata.getCategories() : Set.of();

        String title = metadata != null ? metadata.getTitle() : null;
        String series = metadata != null ? metadata.getSeriesName() : null;
        String isbn10 = metadata != null ? metadata.getIsbn10() : null;
        String isbn13 = metadata != null ? metadata.getIsbn13() : null;
        String fileName = book.getPrimaryFile() != null ? book.getPrimaryFile().getFileName() : book.getFileName();

        if (normalizeForSearch(title).contains(normalizedTerm)) return true;
        if (normalizeForSearch(series).contains(normalizedTerm)) return true;
        if (normalizeForSearch(isbn10).contains(normalizedTerm)) return true;
        if (normalizeForSearch(isbn13).contains(normalizedTerm)) return true;
        if (normalizeForSearch(fileName).contains(normalizedTerm)) return true;

        for (String author : authors) {
            if (normalizeForSearch(author).contains(normalizedTerm)) {
                return true;
            }
        }

        for (String category : categories) {
            if (normalizeForSearch(category).contains(normalizedTerm)) {
                return true;
            }
        }

        return false;
    }

    private String normalizeForSearch(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        normalized = COMBINING_MARKS_PATTERN.matcher(normalized).replaceAll("");
        normalized = normalized
                .replace("ø", "o")
                .replace("Ø", "o")
                .replace("ł", "l")
                .replace("Ł", "l")
                .replace("æ", "ae")
                .replace("Æ", "ae")
                .replace("œ", "oe")
                .replace("Œ", "oe")
                .replace("ß", "ss");
        normalized = PUNCTUATION_PATTERN.matcher(normalized).replaceAll("");
        normalized = WHITESPACE_PATTERN.matcher(normalized).replaceAll(" ").trim();
        return normalized.toLowerCase(Locale.ROOT);
    }

    private List<Book> applyFilters(List<Book> books,
                                    Map<String, List<Object>> activeFilters,
                                    String filterMode,
                                    String excludeFilterType) {
        if (activeFilters == null || activeFilters.isEmpty()) {
            return books;
        }

        List<Map.Entry<String, List<Object>>> filterEntries = activeFilters.entrySet().stream()
                .filter(entry -> excludeFilterType == null || !excludeFilterType.equals(entry.getKey()))
                .filter(entry -> entry.getValue() != null && !entry.getValue().isEmpty())
                .toList();

        if (filterEntries.isEmpty()) {
            return books;
        }

        String mode = normalizeFilterMode(filterMode);
        return books.stream()
                .filter(book -> matchesAllFilters(book, filterEntries, mode))
                .toList();
    }

    private boolean matchesAllFilters(Book book, List<Map.Entry<String, List<Object>>> filterEntries, String mode) {
        List<Boolean> matches = filterEntries.stream()
                .map(entry -> doesBookMatchFilter(book, entry.getKey(), entry.getValue(), mode))
                .toList();

        if ("not".equals(mode)) {
            return matches.stream().allMatch(match -> !match);
        }

        if ("or".equals(mode)) {
            return matches.stream().anyMatch(Boolean::booleanValue);
        }

        return matches.stream().allMatch(Boolean::booleanValue);
    }

    private boolean doesBookMatchFilter(Book book, String filterType, List<Object> filterValues, String mode) {
        if (filterValues == null || filterValues.isEmpty()) {
            return "or".equals(mode);
        }

        String effectiveMode = "not".equals(mode) ? "or" : mode;
        BookMetadata metadata = book.getMetadata();

        return switch (filterType) {
            case "author" -> matchesCollection(metadata != null ? metadata.getAuthors() : null, filterValues, effectiveMode);
            case "category" -> matchesCollection(metadata != null ? metadata.getCategories() : null, filterValues, effectiveMode);
            case "series" -> matchesSingleValue(trimToNull(metadata != null ? metadata.getSeriesName() : null), filterValues, effectiveMode);
            case "bookType" -> matchesBookType(book, filterValues);
            case "readStatus" -> filterValues.stream().anyMatch(value -> looselyEquals(getReadStatus(book), value));
            case "personalRating" -> filterValues.stream().anyMatch(value -> isRatingInRange10(book.getPersonalRating(), value));
            case "publisher" -> matchesSingleValue(metadata != null ? metadata.getPublisher() : null, filterValues, effectiveMode);
            case "matchScore" -> filterValues.stream().anyMatch(value -> isMatchScoreInRange(book.getMetadataMatchScore(), value));
            case "library" -> matchesSingleValue(book.getLibraryId(), filterValues, effectiveMode);
            case "shelf" -> matchesShelf(book, filterValues, effectiveMode);
            case "shelfStatus" -> filterValues.stream().anyMatch(value -> looselyEquals(isUnshelved(book) ? "unshelved" : "shelved", value));
            case "tag" -> matchesCollection(metadata != null ? metadata.getTags() : null, filterValues, effectiveMode);
            case "publishedDate" -> matchesPublishedYear(metadata, filterValues);
            case "fileSize" -> filterValues.stream().anyMatch(value -> isFileSizeInRange(book.getFileSizeKb(), value));
            case "amazonRating" -> filterValues.stream().anyMatch(value -> isRatingInRange(metadata != null ? metadata.getAmazonRating() : null, value));
            case "goodreadsRating" -> filterValues.stream().anyMatch(value -> isRatingInRange(metadata != null ? metadata.getGoodreadsRating() : null, value));
            case "hardcoverRating" -> filterValues.stream().anyMatch(value -> isRatingInRange(metadata != null ? metadata.getHardcoverRating() : null, value));
            case "language" -> filterValues.stream().anyMatch(value -> looselyEquals(metadata != null ? metadata.getLanguage() : null, value));
            case "pageCount" -> filterValues.stream().anyMatch(value -> isPageCountInRange(metadata != null ? metadata.getPageCount() : null, value));
            case "mood" -> matchesCollection(metadata != null ? metadata.getMoods() : null, filterValues, effectiveMode);
            case "ageRating" -> filterValues.stream().anyMatch(value -> looselyEquals(metadata != null ? metadata.getAgeRating() : null, value));
            case "contentRating" -> filterValues.stream().anyMatch(value -> looselyEquals(metadata != null ? metadata.getContentRating() : null, value));
            case "narrator" -> filterValues.stream().anyMatch(value -> looselyEquals(metadata != null ? metadata.getNarrator() : null, value));
            case "comicCharacter" -> matchesCollection(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getCharacters() : null, filterValues, effectiveMode);
            case "comicTeam" -> matchesCollection(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getTeams() : null, filterValues, effectiveMode);
            case "comicLocation" -> matchesCollection(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getLocations() : null, filterValues, effectiveMode);
            case "comicCreator" -> matchesCollection(getComicCreatorIds(metadata), filterValues, effectiveMode);
            default -> false;
        };
    }

    private boolean matchesBookType(Book book, List<Object> filterValues) {
        if (Boolean.TRUE.equals(book.getIsPhysical())) {
            return filterValues.stream().anyMatch(value -> looselyEquals("PHYSICAL", value));
        }

        String bookType = book.getPrimaryFile() != null && book.getPrimaryFile().getBookType() != null
                ? book.getPrimaryFile().getBookType().name()
                : null;
        return filterValues.stream().anyMatch(value -> looselyEquals(bookType, value));
    }

    private boolean matchesShelf(Book book, List<Object> filterValues, String effectiveMode) {
        List<Shelf> shelves = book.getShelves() != null ? new ArrayList<>(book.getShelves()) : List.of();
        if ("or".equals(effectiveMode)) {
            return filterValues.stream().anyMatch(value -> shelves.stream().anyMatch(shelf -> looselyEquals(shelf.getId(), value)));
        }

        return filterValues.stream().allMatch(value -> shelves.stream().anyMatch(shelf -> looselyEquals(shelf.getId(), value)));
    }

    private boolean matchesPublishedYear(BookMetadata metadata, List<Object> filterValues) {
        if (metadata == null || metadata.getPublishedDate() == null) {
            return false;
        }

        int year = metadata.getPublishedDate().getYear();
        return filterValues.stream().anyMatch(value -> looselyEquals(year, value));
    }

    private boolean matchesCollection(Collection<?> values, List<Object> filterValues, String effectiveMode) {
        List<?> collection = values == null ? List.of() : new ArrayList<>(values);
        if ("or".equals(effectiveMode)) {
            return filterValues.stream().anyMatch(value -> collection.stream().anyMatch(item -> looselyEquals(item, value)));
        }

        return filterValues.stream().allMatch(value -> collection.stream().anyMatch(item -> looselyEquals(item, value)));
    }

    private boolean matchesSingleValue(Object value, List<Object> filterValues, String effectiveMode) {
        if ("or".equals(effectiveMode)) {
            return filterValues.stream().anyMatch(filterValue -> looselyEquals(value, filterValue));
        }

        return filterValues.stream().allMatch(filterValue -> looselyEquals(value, filterValue));
    }

    private boolean looselyEquals(Object left, Object right) {
        if (left == null || right == null) {
            return false;
        }
        return Objects.equals(String.valueOf(left), String.valueOf(right));
    }

    private String getReadStatus(Book book) {
        return book.getReadStatus() == null ? "UNSET" : book.getReadStatus();
    }

    private boolean isUnshelved(Book book) {
        return book.getShelves() == null || book.getShelves().isEmpty();
    }

    private boolean hasShelf(Book book, Long shelfId) {
        if (book.getShelves() == null || book.getShelves().isEmpty()) {
            return false;
        }

        return book.getShelves().stream().anyMatch(shelf -> Objects.equals(shelf.getId(), shelfId));
    }

    private String normalizeFilterMode(String filterMode) {
        if (filterMode == null || filterMode.isBlank()) {
            return "and";
        }
        return filterMode.toLowerCase(Locale.ROOT);
    }

    private boolean shouldCollapseSeries(BookBrowserQueryRequest request) {
        return Boolean.TRUE.equals(request.getSeriesCollapsed()) && !hasSeriesFilter(request.getFilters());
    }

    private boolean hasSeriesFilter(Map<String, List<Object>> filters) {
        return filters != null
                && filters.containsKey("series")
                && filters.get("series") != null
                && !filters.get("series").isEmpty();
    }

    private List<Book> applySeriesCollapse(List<Book> books) {
        Map<String, List<Book>> seriesMap = new LinkedHashMap<>();
        List<Book> collapsedBooks = new ArrayList<>();

        for (Book book : books) {
            String seriesName = trimToNull(book.getMetadata() != null ? book.getMetadata().getSeriesName() : null);
            if (seriesName == null) {
                collapsedBooks.add(book);
                continue;
            }

            seriesMap.computeIfAbsent(seriesName, ignored -> new ArrayList<>()).add(book);
        }

        for (List<Book> seriesBooks : seriesMap.values()) {
            List<Book> sortedGroup = seriesBooks.stream()
                    .sorted(Comparator.comparing(this::getSeriesNumberOrMax))
                    .toList();

            Book firstBook = sortedGroup.getFirst();
            Book collapsedBook = Book.builder()
                    .id(firstBook.getId())
                    .libraryId(firstBook.getLibraryId())
                    .libraryName(firstBook.getLibraryName())
                    .primaryFile(firstBook.getPrimaryFile())
                    .fileName(firstBook.getFileName())
                    .filePath(firstBook.getFilePath())
                    .fileSizeKb(firstBook.getFileSizeKb())
                    .title(firstBook.getTitle())
                    .lastReadTime(firstBook.getLastReadTime())
                    .addedOn(firstBook.getAddedOn())
                    .metadata(firstBook.getMetadata())
                    .metadataMatchScore(firstBook.getMetadataMatchScore())
                    .pdfProgress(firstBook.getPdfProgress())
                    .epubProgress(firstBook.getEpubProgress())
                    .cbxProgress(firstBook.getCbxProgress())
                    .audiobookProgress(firstBook.getAudiobookProgress())
                    .koreaderProgress(firstBook.getKoreaderProgress())
                    .koboProgress(firstBook.getKoboProgress())
                    .personalRating(firstBook.getPersonalRating())
                    .shelves(firstBook.getShelves())
                    .readStatus(firstBook.getReadStatus())
                    .dateFinished(firstBook.getDateFinished())
                    .libraryPath(firstBook.getLibraryPath())
                    .alternativeFormats(firstBook.getAlternativeFormats())
                    .supplementaryFiles(firstBook.getSupplementaryFiles())
                    .isPhysical(firstBook.getIsPhysical())
                    .build();
            collapsedBook.setSeriesBooks(new ArrayList<>(seriesBooks));
            collapsedBook.setSeriesCount(seriesBooks.size());
            collapsedBooks.add(collapsedBook);
        }

        return collapsedBooks;
    }

    private float getSeriesNumberOrMax(Book book) {
        if (book.getMetadata() == null || book.getMetadata().getSeriesNumber() == null) {
            return Float.MAX_VALUE;
        }
        return book.getMetadata().getSeriesNumber();
    }

    private List<BookBrowserSortCriterion> resolveSortCriteria(BookBrowserQueryRequest request) {
        if (request.getSortCriteria() != null && !request.getSortCriteria().isEmpty()) {
            return request.getSortCriteria();
        }

        if (request.getSortField() != null && !request.getSortField().isBlank()) {
            return List.of(BookBrowserSortCriterion.builder()
                    .field(request.getSortField())
                    .direction(request.getSortDirection())
                    .build());
        }

        return List.of(BookBrowserSortCriterion.builder()
                .field("addedOn")
                .direction("DESCENDING")
                .build());
    }

    private List<Book> sortBooks(List<Book> books, List<BookBrowserSortCriterion> sortCriteria, Integer randomSeed) {
        List<BookBrowserSortCriterion> criteria = (sortCriteria == null || sortCriteria.isEmpty())
                ? List.of(BookBrowserSortCriterion.builder().field("addedOn").direction("DESCENDING").build())
                : sortCriteria;

        Comparator<Book> comparator = buildSortComparator(criteria.getFirst(), randomSeed);
        for (int i = 1; i < criteria.size(); i++) {
            comparator = comparator.thenComparing(buildSortComparator(criteria.get(i), randomSeed));
        }

        comparator = comparator.thenComparing(Book::getId, Comparator.nullsLast(Long::compareTo));
        return books.stream().sorted(comparator).toList();
    }

    private Comparator<Book> buildSortComparator(BookBrowserSortCriterion criterion, Integer randomSeed) {
        String field = criterion == null || criterion.getField() == null || criterion.getField().isBlank()
                ? "addedOn"
                : criterion.getField();

        Comparator<Book> comparator = (left, right) -> compareBooks(left, right, field, randomSeed);
        return isAscending(criterion != null ? criterion.getDirection() : null) ? comparator : comparator.reversed();
    }

    private boolean isAscending(String direction) {
        return direction != null && ("ASCENDING".equalsIgnoreCase(direction) || "ASC".equalsIgnoreCase(direction));
    }

    private int compareBooks(Book left, Book right, String field, Integer randomSeed) {
        return switch (field) {
            case "title" -> compareNatural(lowercase(getMetadataField(left, BookMetadata::getTitle)), lowercase(getMetadataField(right, BookMetadata::getTitle)));
            case "fileName" -> compareNatural(left.getFileName(), right.getFileName());
            case "filePath" -> compareNatural(left.getFilePath(), right.getFilePath());
            case "author" -> compareNatural(joinLower(getMetadataField(left, BookMetadata::getAuthors)), joinLower(getMetadataField(right, BookMetadata::getAuthors)));
            case "authorSurnameVorname" -> compareNatural(joinLower(transformAuthorsToSurnameFirst(getMetadataField(left, BookMetadata::getAuthors))), joinLower(transformAuthorsToSurnameFirst(getMetadataField(right, BookMetadata::getAuthors))));
            case "seriesName" -> compareNatural(lowercase(getMetadataField(left, BookMetadata::getSeriesName)), lowercase(getMetadataField(right, BookMetadata::getSeriesName)));
            case "seriesNumber" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getSeriesNumber), getMetadataField(right, BookMetadata::getSeriesNumber));
            case "lastReadTime" -> compareNullableInstants(left.getLastReadTime(), right.getLastReadTime());
            case "personalRating" -> compareNullableNumbers(left.getPersonalRating(), right.getPersonalRating());
            case "addedOn" -> compareNullableInstants(left.getAddedOn(), right.getAddedOn());
            case "fileSizeKb" -> compareNullableNumbers(left.getFileSizeKb(), right.getFileSizeKb());
            case "locked" -> compareNullableBooleans(getMetadataField(left, BookMetadata::getAllMetadataLocked), getMetadataField(right, BookMetadata::getAllMetadataLocked));
            case "publisher" -> compareNatural(getMetadataField(left, BookMetadata::getPublisher), getMetadataField(right, BookMetadata::getPublisher));
            case "publishedDate" -> compareNullableInstants(
                    getMetadataField(left, metadata -> metadata.getPublishedDate() != null ? metadata.getPublishedDate().atStartOfDay(ZoneId.systemDefault()).toInstant() : null),
                    getMetadataField(right, metadata -> metadata.getPublishedDate() != null ? metadata.getPublishedDate().atStartOfDay(ZoneId.systemDefault()).toInstant() : null)
            );
            case "readStatus" -> compareNullableNumbers(READ_STATUS_RANK.get(getReadStatus(left)), READ_STATUS_RANK.get(getReadStatus(right)));
            case "dateFinished" -> compareNullableInstants(left.getDateFinished(), right.getDateFinished());
            case "readingProgress" -> compareNullableNumbers(getReadingProgress(left), getReadingProgress(right));
            case "bookType" -> compareNatural(getSortableBookType(left), getSortableBookType(right));
            case "amazonRating" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getAmazonRating), getMetadataField(right, BookMetadata::getAmazonRating));
            case "amazonReviewCount" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getAmazonReviewCount), getMetadataField(right, BookMetadata::getAmazonReviewCount));
            case "goodreadsRating" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getGoodreadsRating), getMetadataField(right, BookMetadata::getGoodreadsRating));
            case "goodreadsReviewCount" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getGoodreadsReviewCount), getMetadataField(right, BookMetadata::getGoodreadsReviewCount));
            case "hardcoverRating" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getHardcoverRating), getMetadataField(right, BookMetadata::getHardcoverRating));
            case "hardcoverReviewCount" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getHardcoverReviewCount), getMetadataField(right, BookMetadata::getHardcoverReviewCount));
            case "ranobedbRating" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getRanobedbRating), getMetadataField(right, BookMetadata::getRanobedbRating));
            case "narrator" -> compareNatural(lowercase(getMetadataField(left, BookMetadata::getNarrator)), lowercase(getMetadataField(right, BookMetadata::getNarrator)));
            case "pageCount" -> compareNullableNumbers(getMetadataField(left, BookMetadata::getPageCount), getMetadataField(right, BookMetadata::getPageCount));
            case "random" -> compareNullableNumbers(stableRandomValue(left, randomSeed), stableRandomValue(right, randomSeed));
            default -> compareNullableInstants(left.getAddedOn(), right.getAddedOn());
        };
    }

    private int stableRandomValue(Book book, Integer randomSeed) {
        return Objects.hash(book.getId(), randomSeed == null ? 0 : randomSeed);
    }

    private String getBookType(Book book) {
        if (Boolean.TRUE.equals(book.getIsPhysical())) {
            return "PHYSICAL";
        }
        return book.getPrimaryFile() != null && book.getPrimaryFile().getBookType() != null
                ? book.getPrimaryFile().getBookType().name()
                : null;
    }

    private String getSortableBookType(Book book) {
        return book.getPrimaryFile() != null && book.getPrimaryFile().getBookType() != null
                ? book.getPrimaryFile().getBookType().name()
                : null;
    }

    private Float getReadingProgress(Book book) {
        Float progress = getPercentage(book.getEpubProgress());
        if (progress != null) return progress;

        progress = getPercentage(book.getPdfProgress());
        if (progress != null) return progress;

        progress = getPercentage(book.getCbxProgress());
        if (progress != null) return progress;

        progress = getPercentage(book.getAudiobookProgress());
        if (progress != null) return progress;

        progress = getPercentage(book.getKoreaderProgress());
        if (progress != null) return progress;

        return getPercentage(book.getKoboProgress());
    }

    private Float getPercentage(EpubProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private Float getPercentage(PdfProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private Float getPercentage(CbxProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private Float getPercentage(AudiobookProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private Float getPercentage(KoProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private Float getPercentage(KoboProgress progress) {
        return progress != null ? progress.getPercentage() : null;
    }

    private <T> T getMetadataField(Book book, java.util.function.Function<BookMetadata, T> extractor) {
        if (book.getMetadata() == null) {
            return null;
        }
        return extractor.apply(book.getMetadata());
    }

    private List<String> transformAuthorsToSurnameFirst(List<String> authors) {
        if (authors == null) {
            return List.of();
        }

        return authors.stream()
                .map(author -> {
                    List<String> parts = List.of(author.trim().split("\\s+"));
                    if (parts.size() < 2) {
                        return author.toLowerCase(Locale.ROOT);
                    }
                    String surname = parts.getLast();
                    String firstNames = String.join(" ", parts.subList(0, parts.size() - 1));
                    return (surname + ", " + firstNames).toLowerCase(Locale.ROOT);
                })
                .toList();
    }

    private String joinLower(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.stream()
                .map(this::lowercase)
                .filter(Objects::nonNull)
                .reduce((left, right) -> left + ", " + right)
                .orElse(null);
    }

    private String lowercase(String value) {
        return value == null ? null : value.toLowerCase(Locale.ROOT);
    }

    private int compareNullableInstants(Instant left, Instant right) {
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return left.compareTo(right);
    }

    private int compareNullableBooleans(Boolean left, Boolean right) {
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return Boolean.compare(left, right);
    }

    private int compareNullableNumbers(Number left, Number right) {
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;
        return Double.compare(left.doubleValue(), right.doubleValue());
    }

    private int compareNatural(String left, String right) {
        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;

        List<String> leftChunks = splitNaturalChunks(left);
        List<String> rightChunks = splitNaturalChunks(right);
        int maxLength = Math.max(leftChunks.size(), rightChunks.size());

        for (int i = 0; i < maxLength; i++) {
            String leftChunk = i < leftChunks.size() ? leftChunks.get(i) : "";
            String rightChunk = i < rightChunks.size() ? rightChunks.get(i) : "";

            if (leftChunk.isEmpty() && rightChunk.isEmpty()) {
                continue;
            }

            boolean leftNumeric = leftChunk.chars().allMatch(Character::isDigit);
            boolean rightNumeric = rightChunk.chars().allMatch(Character::isDigit);
            if (leftNumeric && rightNumeric) {
                int comparison = Integer.compare(Integer.parseInt(leftChunk), Integer.parseInt(rightChunk));
                if (comparison != 0) {
                    return comparison;
                }
                continue;
            }

            int comparison = leftChunk.compareTo(rightChunk);
            if (comparison != 0) {
                return comparison;
            }
        }

        return Integer.compare(leftChunks.size(), rightChunks.size());
    }

    private List<String> splitNaturalChunks(String value) {
        Matcher matcher = NATURAL_CHUNK_PATTERN.matcher(value);
        List<String> chunks = new ArrayList<>();
        while (matcher.find()) {
            chunks.add(matcher.group());
        }
        return chunks.isEmpty() ? List.of(value) : chunks;
    }

    private PagedResponse<Book> paginate(List<Book> books, BookBrowserQueryRequest request) {
        int page = Math.max(request.getPage() == null ? 0 : request.getPage(), 0);
        int size = clampSize(request.getSize());
        int totalElements = books.size();
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / size);

        return PagedResponse.<Book>builder()
                .content(books.subList(fromIndex, toIndex))
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .first(page == 0)
                .last(toIndex >= totalElements)
                .build();
    }

    private int clampSize(Integer size) {
        if (size == null || size < 1) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private List<BookBrowserFacetValue> buildFacetValues(String filterType, List<Book> books) {
        Map<String, FacetAccumulator> facetMap = new LinkedHashMap<>();

        for (Book book : books) {
            for (BookBrowserFilterValue filterValue : extractFacetValues(filterType, book)) {
                String key = String.valueOf(filterValue.getId());
                facetMap.computeIfAbsent(key, ignored -> new FacetAccumulator(filterValue)).increment();
            }
        }

        List<BookBrowserFacetValue> facets = facetMap.values().stream()
                .map(accumulator -> BookBrowserFacetValue.builder()
                        .value(accumulator.filterValue)
                        .bookCount(accumulator.bookCount)
                        .build())
                .toList();

        Comparator<BookBrowserFacetValue> comparator = SORT_INDEX_FILTERS.contains(filterType)
                ? Comparator
                    .comparing((BookBrowserFacetValue value) -> value.getValue().getSortIndex() == null ? 999 : value.getValue().getSortIndex())
                    .thenComparing(value -> value.getValue().getName(), Comparator.nullsLast(String::compareTo))
                : Comparator
                    .comparingLong(BookBrowserFacetValue::getBookCount)
                    .reversed()
                    .thenComparing(value -> value.getValue().getName(), Comparator.nullsLast(String::compareTo));

        return facets.stream()
                .sorted(comparator)
                .limit(MAX_FILTER_ITEMS)
                .toList();
    }

    private List<BookBrowserFilterValue> extractFacetValues(String filterType, Book book) {
        BookMetadata metadata = book.getMetadata();
        return switch (filterType) {
            case "author" -> stringFacetValues(metadata != null ? metadata.getAuthors() : null);
            case "category" -> stringFacetValues(metadata != null ? metadata.getCategories() : null);
            case "series" -> singleFacetValue(trimToNull(metadata != null ? metadata.getSeriesName() : null));
            case "bookType" -> singleFacetValue(getBookType(book));
            case "readStatus" -> List.of(namedFacetValue(getReadStatus(book), READ_STATUS_LABELS.getOrDefault(getReadStatus(book), getReadStatus(book)), null));
            case "personalRating" -> exactRangeFacetValue(book.getPersonalRating(), RATING_OPTIONS_10);
            case "publisher" -> singleFacetValue(metadata != null ? metadata.getPublisher() : null);
            case "matchScore" -> rangedFacetValue(normalizeMatchScore(book.getMetadataMatchScore()), MATCH_SCORE_RANGES);
            case "library" -> List.of(namedFacetValue(book.getLibraryId(), book.getLibraryName(), null));
            case "shelf" -> shelfFacetValues(book.getShelves());
            case "shelfStatus" -> List.of(namedFacetValue(isUnshelved(book) ? "unshelved" : "shelved", isUnshelved(book) ? "Unshelved" : "Shelved", null));
            case "tag" -> stringFacetValues(metadata != null ? metadata.getTags() : null);
            case "publishedDate" -> publishedYearFacetValue(metadata);
            case "fileSize" -> rangedFacetValue(book.getFileSizeKb(), FILE_SIZE_RANGES);
            case "amazonRating" -> rangedFacetValue(metadata != null ? metadata.getAmazonRating() : null, RATING_RANGES_5);
            case "goodreadsRating" -> rangedFacetValue(metadata != null ? metadata.getGoodreadsRating() : null, RATING_RANGES_5);
            case "hardcoverRating" -> rangedFacetValue(metadata != null ? metadata.getHardcoverRating() : null, RATING_RANGES_5);
            case "language" -> singleFacetValue(metadata != null ? metadata.getLanguage() : null);
            case "pageCount" -> rangedFacetValue(metadata != null ? metadata.getPageCount() : null, PAGE_COUNT_RANGES);
            case "mood" -> stringFacetValues(metadata != null ? metadata.getMoods() : null);
            case "ageRating" -> exactRangeFacetValue(metadata != null ? metadata.getAgeRating() : null, AGE_RATING_OPTIONS);
            case "contentRating" -> contentRatingFacetValue(metadata != null ? metadata.getContentRating() : null);
            case "narrator" -> singleFacetValue(metadata != null ? metadata.getNarrator() : null);
            case "comicCharacter" -> stringFacetValues(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getCharacters() : null);
            case "comicTeam" -> stringFacetValues(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getTeams() : null);
            case "comicLocation" -> stringFacetValues(metadata != null && metadata.getComicMetadata() != null ? metadata.getComicMetadata().getLocations() : null);
            case "comicCreator" -> comicCreatorFacetValues(metadata);
            default -> List.of();
        };
    }

    private List<BookBrowserFilterValue> stringFacetValues(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }

        return values.stream()
                .filter(Objects::nonNull)
                .map(value -> namedFacetValue(value, value, null))
                .toList();
    }

    private List<BookBrowserFilterValue> singleFacetValue(String value) {
        String trimmed = trimToNull(value);
        if (trimmed == null) {
            return List.of();
        }
        return List.of(namedFacetValue(trimmed, trimmed, null));
    }

    private List<BookBrowserFilterValue> publishedYearFacetValue(BookMetadata metadata) {
        if (metadata == null || metadata.getPublishedDate() == null) {
            return List.of();
        }

        String year = String.valueOf(metadata.getPublishedDate().getYear());
        return List.of(namedFacetValue(year, year, null));
    }

    private List<BookBrowserFilterValue> rangedFacetValue(Number value, List<RangeOption> ranges) {
        if (value == null) {
            return List.of();
        }

        RangeOption match = ranges.stream()
                .filter(range -> value.doubleValue() >= range.min && value.doubleValue() < range.max)
                .findFirst()
                .orElse(null);

        if (match == null) {
            return List.of();
        }

        return List.of(namedFacetValue(match.id, match.label, match.sortIndex));
    }

    private List<BookBrowserFilterValue> exactRangeFacetValue(Number value, List<RangeOption> ranges) {
        if (value == null) {
            return List.of();
        }

        RangeOption match = ranges.stream()
                .filter(range -> range.id == value.intValue())
                .findFirst()
                .orElse(null);

        if (match == null) {
            return List.of();
        }

        return List.of(namedFacetValue(match.id, match.label, match.sortIndex));
    }

    private List<BookBrowserFilterValue> shelfFacetValues(Set<Shelf> shelves) {
        if (shelves == null || shelves.isEmpty()) {
            return List.of();
        }

        return shelves.stream()
                .map(shelf -> namedFacetValue(shelf.getId(), shelf.getName(), null))
                .toList();
    }

    private List<BookBrowserFilterValue> contentRatingFacetValue(String contentRating) {
        if (contentRating == null || contentRating.isBlank()) {
            return List.of();
        }

        return List.of(namedFacetValue(contentRating, CONTENT_RATING_LABELS.getOrDefault(contentRating, contentRating), null));
    }

    private List<BookBrowserFilterValue> comicCreatorFacetValues(BookMetadata metadata) {
        if (metadata == null || metadata.getComicMetadata() == null) {
            return List.of();
        }

        List<BookBrowserFilterValue> values = new ArrayList<>();
        addComicCreators(values, metadata.getComicMetadata().getPencillers(), "penciller");
        addComicCreators(values, metadata.getComicMetadata().getInkers(), "inker");
        addComicCreators(values, metadata.getComicMetadata().getColorists(), "colorist");
        addComicCreators(values, metadata.getComicMetadata().getLetterers(), "letterer");
        addComicCreators(values, metadata.getComicMetadata().getCoverArtists(), "coverArtist");
        addComicCreators(values, metadata.getComicMetadata().getEditors(), "editor");
        return values;
    }

    private List<String> getComicCreatorIds(BookMetadata metadata) {
        return comicCreatorFacetValues(metadata).stream()
                .map(filterValue -> String.valueOf(filterValue.getId()))
                .toList();
    }

    private void addComicCreators(List<BookBrowserFilterValue> values, Collection<String> names, String role) {
        if (names == null) {
            return;
        }

        String roleLabel = COMIC_ROLE_LABELS.getOrDefault(role, role);
        for (String name : names) {
            values.add(namedFacetValue(name + ":" + role, name + " (" + roleLabel + ")", null));
        }
    }

    private BookBrowserFilterValue namedFacetValue(Object id, String name, Integer sortIndex) {
        return BookBrowserFilterValue.builder()
                .id(id)
                .name(name)
                .sortIndex(sortIndex)
                .build();
    }

    private boolean isRatingInRange(Number rating, Object rangeId) {
        if (rating == null) {
            return false;
        }

        Integer id = toInteger(rangeId);
        if (id == null) {
            return false;
        }

        RangeOption range = RATING_RANGES_5.stream().filter(option -> option.id == id).findFirst().orElse(null);
        return range != null && rating.doubleValue() >= range.min && rating.doubleValue() < range.max;
    }

    private boolean isRatingInRange10(Number rating, Object rangeId) {
        Integer id = toInteger(rangeId);
        return rating != null && id != null && Math.round(rating.doubleValue()) == id;
    }

    private boolean isFileSizeInRange(Number fileSizeKb, Object rangeId) {
        if (fileSizeKb == null) {
            return false;
        }

        Integer id = toInteger(rangeId);
        if (id == null) {
            return false;
        }

        RangeOption range = FILE_SIZE_RANGES.stream().filter(option -> option.id == id).findFirst().orElse(null);
        return range != null && fileSizeKb.doubleValue() >= range.min && fileSizeKb.doubleValue() < range.max;
    }

    private boolean isPageCountInRange(Number pageCount, Object rangeId) {
        if (pageCount == null) {
            return false;
        }

        Integer id = toInteger(rangeId);
        if (id == null) {
            return false;
        }

        RangeOption range = PAGE_COUNT_RANGES.stream().filter(option -> option.id == id).findFirst().orElse(null);
        return range != null && pageCount.doubleValue() >= range.min && pageCount.doubleValue() < range.max;
    }

    private boolean isMatchScoreInRange(Number score, Object rangeId) {
        if (score == null) {
            return false;
        }

        Integer id = toInteger(rangeId);
        if (id == null) {
            return false;
        }

        Double normalized = normalizeMatchScore(score);
        if (normalized == null) {
            return false;
        }

        RangeOption range = MATCH_SCORE_RANGES.stream().filter(option -> option.id == id).findFirst().orElse(null);
        return range != null && normalized >= range.min && normalized < range.max;
    }

    private Double normalizeMatchScore(Number score) {
        if (score == null) {
            return null;
        }
        return score.doubleValue() > 1 ? score.doubleValue() / 100d : score.doubleValue();
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.intValue();
        }

        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private <T> T requireValue(T value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " is required for the selected scope");
        }
        return value;
    }

    private static final class FacetAccumulator {
        private final BookBrowserFilterValue filterValue;
        private long bookCount = 0;

        private FacetAccumulator(BookBrowserFilterValue filterValue) {
            this.filterValue = filterValue;
        }

        private void increment() {
            this.bookCount++;
        }
    }

    private record RangeOption(int id, String label, double min, double max, int sortIndex) {
    }
}
