package org.booklore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SyncActivityRecord {

    public enum SyncSource {
        KOBO, KOREADER, OPDS, BROWSER
    }

    public enum SyncOutcome {
        SUCCESS, CONFLICT_RESOLVED, FAILED
    }

    private Long bookId;
    private String bookTitle;
    private Long userId;
    private SyncSource source;
    private SyncOutcome outcome;
    private Float progressPercent;
    private String conflictDetails;
    private String keptValue;
    private Instant syncedAt;
    private String failureReason;
}
