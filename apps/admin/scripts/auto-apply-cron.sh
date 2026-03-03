#!/bin/bash
#
# Auto-Apply Cron Job
#
# Schedule this script to run automatically via OpenClaw cron or system cron.
#
# OpenClaw Cron Example:
#   openclaw cron add "0 9,17 * * *" "cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh"
#
# System Cron Example (crontab -e):
#   0 9,17 * * * cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh >> ~/logs/auto-apply.log 2>&1
#
# Runs twice daily: 9 AM and 5 PM

set -e  # Exit on error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
LOG_DIR="$HOME/logs/auto-apply"
LOG_FILE="$LOG_DIR/auto-apply-$(date +%Y-%m-%d).log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Log start
echo "========================================" >> "$LOG_FILE"
echo "Auto-Apply Cron Job Started" >> "$LOG_FILE"
echo "Time: $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Change to project directory
cd "$PROJECT_ROOT"

# Load environment variables
if [ -f ".env.local" ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if CONVEX_URL is set
if [ -z "$CONVEX_URL" ]; then
  echo "ERROR: CONVEX_URL not set" >> "$LOG_FILE"
  exit 1
fi

# Run auto-apply script
echo "Running auto-apply..." >> "$LOG_FILE"
tsx apps/admin/scripts/auto-apply.ts >> "$LOG_FILE" 2>&1

# Log completion
echo "========================================" >> "$LOG_FILE"
echo "Auto-Apply Cron Job Completed" >> "$LOG_FILE"
echo "Time: $(date)" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Cleanup old logs (keep last 30 days)
find "$LOG_DIR" -name "auto-apply-*.log" -mtime +30 -delete

exit 0
