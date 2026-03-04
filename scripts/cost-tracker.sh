#!/bin/bash
##
# Cost Tracking Script
# 
# Tracks all business costs and logs to Convex
# Run daily to keep cost dashboard updated
##

CONVEX_URL="${CONVEX_URL:-https://honorable-elk-818.eu-west-1.convex.cloud}"
LOG_FILE="$HOME/logs/cost-tracker.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

track_cost() {
  local service="$1"
  local amount="$2"
  local currency="${3:-EUR}"
  local period="${4:-monthly}"
  
  log "💰 Tracking: $service = $currency $amount ($period)"
  
  # TODO: Push to Convex cost_tracking table
  # For now, just log
}

main() {
  log "💰 Running cost tracker..."
  
  # Infrastructure
  track_cost "Vercel Pro" 20 EUR monthly
  track_cost "Convex Pro" 25 USD monthly
  track_cost "Domain (leroysteding.nl)" 15 EUR yearly
  
  # Services
  track_cost "Clerk Auth" 0 EUR monthly  # Free tier
  track_cost "GitHub Pro" 0 EUR monthly  # Free for personal
  
  # APIs (usage-based, need to query actual usage)
  # track_cost "OpenAI API" <usage> USD monthly
  # track_cost "Anthropic API" <usage> USD monthly
  
  log "✅ Cost tracking complete"
  
  # Calculate total
  log "📊 TODO: Calculate total monthly cost"
}

main
