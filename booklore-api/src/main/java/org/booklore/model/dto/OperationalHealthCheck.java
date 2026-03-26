package org.booklore.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OperationalHealthCheck {

    public enum Component {
        API, DATABASE, LIBRARY_STORAGE, BOOKDROP, TASKS, SYNC
    }

    public enum HealthStatus {
        HEALTHY, WARNING, UNHEALTHY
    }

    private Component component;
    private HealthStatus status;
    private String summary;
    private String details;
    private String nextAction;
    private Instant updatedAt;
}
