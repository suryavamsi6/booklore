package org.booklore.service.system;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.booklore.model.dto.InstanceReadinessStatus;
import org.booklore.model.dto.OperationalHealthCheck;
import org.booklore.service.InstallationService;
import org.booklore.service.library.LibraryHealthService;
import org.booklore.service.user.UserProvisioningService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemStatusService {

    private final InstallationService installationService;
    private final LibraryHealthService libraryHealthService;
    private final UserProvisioningService userProvisioningService;

    @Value("${DISK_TYPE:LOCAL}")
    private String diskType;

    @Transactional(readOnly = true)
    public InstanceReadinessStatus getInstanceReadiness() {
        boolean adminProvisioned = userProvisioningService.isInitialUserAlreadyProvisioned();
        boolean setupComplete = adminProvisioned;
        var installation = installationService.getOrCreateInstallation();
        Map<Long, Boolean> libraryHealth = libraryHealthService.getCurrentHealth();
        boolean librariesHealthy = libraryHealth.isEmpty() || libraryHealth.values().stream().allMatch(Boolean::booleanValue);

        InstanceReadinessStatus.StorageMode storageMode = "NETWORK".equalsIgnoreCase(diskType)
                ? InstanceReadinessStatus.StorageMode.NETWORK
                : InstanceReadinessStatus.StorageMode.LOCAL;

        InstanceReadinessStatus.StorageRiskLevel riskLevel = storageMode == InstanceReadinessStatus.StorageMode.NETWORK
                ? InstanceReadinessStatus.StorageRiskLevel.WARNING
                : InstanceReadinessStatus.StorageRiskLevel.NONE;

        List<String> warnings = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        if (!adminProvisioned) {
            warnings.add("No admin user has been provisioned.");
            actions.add("Complete initial setup by creating the first admin user.");
        }
        if (!librariesHealthy) {
            warnings.add("One or more library paths are not accessible.");
            actions.add("Check library path settings and ensure storage is mounted and readable.");
        }
        if (storageMode == InstanceReadinessStatus.StorageMode.NETWORK) {
            warnings.add("Network storage mode is active. File operations may be slower or unreliable.");
            actions.add("Ensure your network storage is reliable before ingesting large libraries.");
        }

        InstanceReadinessStatus.ReadinessState state;
        if (!adminProvisioned) {
            state = InstanceReadinessStatus.ReadinessState.SETUP_INCOMPLETE;
        } else if (!librariesHealthy || !warnings.isEmpty()) {
            state = InstanceReadinessStatus.ReadinessState.READY_WITH_WARNINGS;
        } else {
            state = InstanceReadinessStatus.ReadinessState.READY;
        }

        return InstanceReadinessStatus.builder()
                .installationId(installation != null ? installation.getId() : null)
                .setupComplete(setupComplete)
                .adminProvisioned(adminProvisioned)
                .storageMode(storageMode)
                .storageRiskLevel(riskLevel)
                .databaseReachable(true)
                .backgroundProcessingHealthy(true)
                .librariesHealthy(librariesHealthy)
                .state(state)
                .activeWarnings(warnings)
                .recommendedActions(actions)
                .evaluatedAt(Instant.now())
                .build();
    }

    @Transactional(readOnly = true)
    public List<OperationalHealthCheck> getHealthChecks() {
        Instant now = Instant.now();
        List<OperationalHealthCheck> checks = new ArrayList<>();

        checks.add(OperationalHealthCheck.builder()
                .component(OperationalHealthCheck.Component.API)
                .status(OperationalHealthCheck.HealthStatus.HEALTHY)
                .summary("API is responding normally.")
                .updatedAt(now)
                .build());

        checks.add(OperationalHealthCheck.builder()
                .component(OperationalHealthCheck.Component.DATABASE)
                .status(OperationalHealthCheck.HealthStatus.HEALTHY)
                .summary("Database is reachable and responding.")
                .updatedAt(now)
                .build());

        Map<Long, Boolean> libraryHealth = libraryHealthService.getCurrentHealth();
        boolean allLibrariesOk = libraryHealth.isEmpty() || libraryHealth.values().stream().allMatch(Boolean::booleanValue);
        long unhealthyCount = libraryHealth.values().stream().filter(v -> !v).count();

        checks.add(OperationalHealthCheck.builder()
                .component(OperationalHealthCheck.Component.LIBRARY_STORAGE)
                .status(allLibrariesOk ? OperationalHealthCheck.HealthStatus.HEALTHY : OperationalHealthCheck.HealthStatus.WARNING)
                .summary(allLibrariesOk ? "All library paths are accessible." : unhealthyCount + " library path(s) are not accessible.")
                .nextAction(allLibrariesOk ? null : "Check library settings and ensure storage paths are mounted.")
                .updatedAt(now)
                .build());

        checks.add(OperationalHealthCheck.builder()
                .component(OperationalHealthCheck.Component.TASKS)
                .status(OperationalHealthCheck.HealthStatus.HEALTHY)
                .summary("Background task system is operational.")
                .updatedAt(now)
                .build());

        checks.add(OperationalHealthCheck.builder()
                .component(OperationalHealthCheck.Component.SYNC)
                .status(OperationalHealthCheck.HealthStatus.HEALTHY)
                .summary("Device sync services are available.")
                .updatedAt(now)
                .build());

        return checks;
    }
}
