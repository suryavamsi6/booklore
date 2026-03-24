package org.booklore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BackupValidationRecord {

    public enum BackupStatus {
        NOT_AVAILABLE, STALE, RECENT, VALIDATED
    }

    private BackupStatus status;
    private Instant lastBackupDetectedAt;
    private List<String> includedComponents;
    private List<String> missingComponents;
    private boolean appearsSufficient;
    private String guidance;
    private Instant evaluatedAt;
}
