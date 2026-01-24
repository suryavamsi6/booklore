-- Add columns to track Hardcover sync state to avoid redundant API calls
ALTER TABLE user_book_progress ADD COLUMN hardcover_last_synced_progress REAL;
ALTER TABLE user_book_progress ADD COLUMN hardcover_last_sync_time TIMESTAMP;
