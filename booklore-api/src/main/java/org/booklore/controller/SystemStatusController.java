package org.booklore.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.booklore.model.dto.BackupValidationRecord;
import org.booklore.model.dto.InstanceReadinessStatus;
import org.booklore.model.dto.OperationalHealthCheck;
import org.booklore.model.dto.response.SuccessResponse;
import org.booklore.service.system.BackupValidationService;
import org.booklore.service.system.SystemStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/system-status")
@AllArgsConstructor
@Tag(name = "System Status", description = "Endpoints for monitoring instance readiness and operational health")
public class SystemStatusController {

    private final SystemStatusService systemStatusService;
    private final BackupValidationService backupValidationService;

    @Operation(summary = "Get instance readiness", description = "Returns the current readiness state of this BookLore installation.")
    @ApiResponse(responseCode = "200", description = "Readiness status returned successfully")
    @GetMapping("/readiness")
    @PreAuthorize("@securityUtil.isAdmin()")
    public ResponseEntity<SuccessResponse<InstanceReadinessStatus>> getReadiness() {
        return ResponseEntity.ok(new SuccessResponse<>(200, "Instance readiness retrieved.", systemStatusService.getInstanceReadiness()));
    }

    @Operation(summary = "Get operational health checks", description = "Returns health check results for each core subsystem.")
    @ApiResponse(responseCode = "200", description = "Health checks returned successfully")
    @GetMapping("/health")
    @PreAuthorize("@securityUtil.isAdmin()")
    public ResponseEntity<SuccessResponse<List<OperationalHealthCheck>>> getHealthChecks() {
        return ResponseEntity.ok(new SuccessResponse<>(200, "Health checks retrieved.", systemStatusService.getHealthChecks()));
    }

    @Operation(summary = "Get backup validation", description = "Returns backup validation information for upgrade confidence.")
    @ApiResponse(responseCode = "200", description = "Backup validation returned successfully")
    @GetMapping("/backup-validation")
    @PreAuthorize("@securityUtil.isAdmin()")
    public ResponseEntity<SuccessResponse<BackupValidationRecord>> getBackupValidation() {
        return ResponseEntity.ok(new SuccessResponse<>(200, "Backup validation retrieved.", backupValidationService.validate()));
    }
}
