#!/bin/bash
# scripts/backup.sh

# Basic PostgreSQL backup script for GestCyber

# Database connection parameters (should match docker-compose.yml)
DB_NAME="${POSTGRES_DB:-gestcyber}"
DB_USER="${POSTGRES_USER:-gestcyber_user}"
# PGPASSWORD should be set in the backup service's environment in docker-compose.yml

# Backup directory (mounted from the host)
BACKUP_DIR="/backups"
DATE_FORMAT=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILENAME="${DB_NAME}_backup_${DATE_FORMAT}.sql.gz"
BACKUP_FILE_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

echo "Starting backup of database '${DB_NAME}'..."

# Ensure backup directory exists
mkdir -p ${BACKUP_DIR}

# Perform the backup using pg_dump
# -Fc: custom format (compressed, suitable for pg_restore)
# Use `pg_dumpall` for roles and tablespace definitions if needed,
# but for a single database, pg_dump is common.
pg_dump -h postgres -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${BACKUP_FILE_PATH}"

if [ $? -eq 0 ]; then
  echo "Backup successful: ${BACKUP_FILE_PATH}"
  # Optional: Clean up old backups (e.g., keep last 7)
  # find "${BACKUP_DIR}" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +7 -delete
  # echo "Old backups cleaned up."
else
  echo "ERROR: Backup failed!"
  # Consider adding notification mechanisms here (e.g., email, Slack)
fi

echo "Backup process finished."
