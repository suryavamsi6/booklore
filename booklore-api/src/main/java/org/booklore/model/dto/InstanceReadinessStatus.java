package org.booklore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InstanceReadinessStatus {

    public enum ReadinessState {
        UNINITIALIZED, SETUP_INCOMPLETE, READY_WITH_WARNINGS, READY, DEGRADED
    }

    public enum StorageMode {
        LOCAL, NETWORK
    }

    public enum StorageRiskLevel {
        NONE, WARNING, BLOCKING
    }

    private String installationId;
    private boolean setupComplete;
    private boolean adminProvisioned;
    private StorageMode storageMode;
    private StorageRiskLevel storageRiskLevel;
    private boolean databaseReachable;
    private boolean backgroundProcessingHealthy;
    private boolean librariesHealthy;
    private ReadinessState state;
    private List<String> activeWarnings;
    private List<String> recommendedActions;
    private Instant evaluatedAt;
}
