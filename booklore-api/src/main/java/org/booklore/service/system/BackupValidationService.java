package org.booklore.service.system;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.booklore.model.dto.BackupValidationRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupValidationService {

    @Value("${app.path-config:/app/data}")
    private String dataPath;

    public BackupValidationRecord validate() {
        Instant now = Instant.now();
        List<String> included = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        Path configPath = Path.of(dataPath);
        boolean configExists = Files.exists(configPath) && Files.isReadable(configPath);
        if (configExists) {
            included.add("Application config directory (" + dataPath + ")");
        } else {
            missing.add("Application config directory (" + dataPath + ") - not accessible");
        }

        included.add("MariaDB database (validate via database-level backup)");

        Instant lastBackupAt = detectLastBackup(configPath);

        BackupValidationRecord.BackupStatus status;
        String guidance;

        if (lastBackupAt == null) {
            status = BackupValidationRecord.BackupStatus.NOT_AVAILABLE;
            guidance = "No backup detected. Before upgrading, back up the database and the " + dataPath + " directory.";
        } else if (lastBackupAt.isBefore(now.minus(7, ChronoUnit.DAYS))) {
            status = BackupValidationRecord.BackupStatus.STALE;
            guidance = "Last backup is more than 7 days old. Create a fresh backup before upgrading.";
        } else {
            status = BackupValidationRecord.BackupStatus.RECENT;
            guidance = "Backup appears recent. Verify the database dump is included before upgrading.";
        }

        return BackupValidationRecord.builder()
                .status(status)
                .lastBackupDetectedAt(lastBackupAt)
                .includedComponents(included)
                .missingComponents(missing)
                .appearsSufficient(missing.isEmpty() && status != BackupValidationRecord.BackupStatus.NOT_AVAILABLE)
                .guidance(guidance)
                .evaluatedAt(now)
                .build();
    }

    private Instant detectLastBackup(Path configPath) {
        if (!Files.exists(configPath)) {
            return null;
        }
        try (Stream<Path> files = Files.list(configPath)) {
            return files
                    .filter(p -> p.getFileName().toString().contains("backup"))
                    .map(p -> {
                        try {
                            return Files.getLastModifiedTime(p).toInstant();
                        } catch (IOException e) {
                            log.debug("Error reading file modification time: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(t -> t != null)
                    .max(Instant::compareTo)
                    .orElse(null);
        } catch (IOException e) {
            log.debug("Could not scan for backup files: {}", e.getMessage());
            return null;
        }
    }
}
