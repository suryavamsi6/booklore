package org.booklore.model.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.booklore.model.dto.BookBrowserScope;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookBrowserQueryRequest {
    private Integer page;
    private Integer size;
    private BookBrowserScope scope;
    private Long libraryId;
    private Long shelfId;
    private Long magicShelfId;
    private String sortField;
    private String sortDirection;
    private List<BookBrowserSortCriterion> sortCriteria;
    private String searchText;
    private String filterMode;
    private Boolean seriesCollapsed;
    private Integer randomSeed;
    private Map<String, List<Object>> filters;
}
