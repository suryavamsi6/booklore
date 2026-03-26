# Contract: Backup Validation

## Purpose

Define the minimum evidence required for BookLore to say a backup appears usable before an upgrade.

## Validation Inputs

- Presence of a recent database backup or equivalent database recovery artifact
- Presence of required app data/config backup
- Presence of library/bookdrop backup evidence where applicable
- Current instance summary for comparison:
  - user count
  - book count
  - latest sync timestamp

## Validation Result Shape

```json
{
  "validationStatus": "VALID",
  "backupType": "DATABASE_DUMP",
  "databaseBackupPresent": true,
  "appDataBackupPresent": true,
  "libraryDataBackupPresent": true,
  "bookdropBackupPresent": true,
  "bookCountSnapshot": 12543,
  "userCountSnapshot": 8,
  "latestSyncTimestamp": "2026-03-24T12:00:00Z",
  "validatedAt": "2026-03-24T12:05:00Z",
  "notes": null
}
```

## Rules

- `VALID` requires a database backup plus the required app/config backup.
- `INCOMPLETE` indicates one or more required backup inputs are missing.
- `STALE` indicates backup evidence exists but no longer appears recent enough relative to current instance state.
- 1.0 backup validation is a pre-flight confidence check, not a full restore simulation.
