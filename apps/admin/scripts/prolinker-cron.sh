#!/bin/bash
##
# ProLinker Scraper Cron Job Script
# 
# This script runs the ProLinker job scraper and logs output.
# Designed to be called by OpenClaw cron or system cron.
#
# Usage:
#   ./apps/admin/scripts/prolinker-cron.sh
#
# Cron setup (every 4 hours):
#   0 */4 * * * /path/to/leroy-steding-portfolio/apps/admin/scripts/prolinker-cron.sh
##

# Configuration
PROJECT_DIR="$HOME/Projects/personal/leroy-steding-portfolio"
LOG_DIR="$HOME/logs"
LOG_FILE="$LOG_DIR/prolinker-scraper.log"
MAX_LOG_SIZE=$((10 * 1024 * 1024)) # 10MB

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Rotate log if it's too large
if [ -f "$LOG_FILE" ] && [ $(wc -c < "$LOG_FILE") -gt $MAX_LOG_SIZE ]; then
    mv "$LOG_FILE" "$LOG_FILE.$(date +%Y%m%d-%H%M%S).old"
    gzip "$LOG_FILE.$(date +%Y%m%d-%H%M%S).old" &
fi

# Log start time
echo "========================================" | tee -a "$LOG_FILE"
echo "ProLinker Scraper Run: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Change to project directory
cd "$PROJECT_DIR" || {
    echo "ERROR: Failed to change to project directory: $PROJECT_DIR" | tee -a "$LOG_FILE"
    exit 1
}

# Load environment variables
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Check if CONVEX_URL is set
if [ -z "$CONVEX_URL" ]; then
    echo "ERROR: CONVEX_URL not set. Please set it in .env.local" | tee -a "$LOG_FILE"
    exit 1
fi

# Run scraper
echo "Running scraper..." | tee -a "$LOG_FILE"
./node_modules/.bin/tsx apps/admin/scripts/scrape-prolinker.ts 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=$?

# Log completion
echo "----------------------------------------" | tee -a "$LOG_FILE"
echo "Completed at: $(date)" | tee -a "$LOG_FILE"
echo "Exit code: $EXIT_CODE" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Exit with scraper's exit code
exit $EXIT_CODE
