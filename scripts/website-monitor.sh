#!/bin/bash
##
# Website Uptime Monitor
# 
# Pings leroysteding.nl every 5 minutes
# Alerts via Telegram if down
##

SITE_URL="https://leroysteding.nl"
LOG_FILE="$HOME/logs/website-monitor.log"
TELEGRAM_CHAT_ID="-1003815346647"  # Steding Agent Crew

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

check_site() {
  log "🔍 Checking $SITE_URL..."
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SITE_URL")
  
  if [ "$HTTP_CODE" = "200" ]; then
    log "✅ Site is UP (HTTP $HTTP_CODE)"
    return 0
  else
    log "❌ Site is DOWN or ERROR (HTTP $HTTP_CODE)"
    
    # Alert via OpenClaw message tool
    openclaw message send \
      --channel telegram \
      --to "$TELEGRAM_CHAT_ID" \
      --message "🚨 **Website Down**

leroysteding.nl returned HTTP $HTTP_CODE

Time: $(date '+%H:%M:%S')
Investigating..." \
      --silent
    
    return 1
  fi
}

main_loop() {
  log "🚀 Starting website monitor for $SITE_URL..."
  
  while true; do
    check_site
    
    # Check every 5 minutes
    sleep 300
  done
}

# Run in background if --daemon flag
if [ "$1" = "--daemon" ]; then
  log "🌙 Starting in daemon mode..."
  nohup bash "$0" >> "$LOG_FILE" 2>&1 &
  echo $! > "$HOME/logs/website-monitor.pid"
  log "✅ Daemon started with PID $(cat $HOME/logs/website-monitor.pid)"
else
  main_loop
fi
