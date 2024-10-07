#!/bin/bash

set -e

# Configuration
DDNS_PROVIDER="duckdns"  # Change this to your DDNS provider
DDNS_DOMAIN="your-domain.duckdns.org"  # Change this to your DDNS domain
DDNS_TOKEN="your-duckdns-token"  # Change this to your DuckDNS token

# Function to update DDNS
update_ddns() {
    local ip=$(curl -s http://ipecho.net/plain)
    echo "Current IP: $ip"
    
    if [ "$DDNS_PROVIDER" = "duckdns" ]; then
        curl "https://www.duckdns.org/update?domains=$DDNS_DOMAIN&token=$DDNS_TOKEN&ip=$ip"
        echo "DuckDNS updated"
    else
        echo "Unsupported DDNS provider. Please update manually."
    fi
}

# Function to check and update IP
check_and_update_ip() {
    local current_ip=$(curl -s http://ipecho.net/plain)
    local stored_ip=$(cat ip.txt 2>/dev/null || echo "")

    if [ "$current_ip" != "$stored_ip" ]; then
        echo $current_ip > ip.txt
        update_ddns
        echo "IP updated and DDNS refreshed"
    else
        echo "IP unchanged"
    fi
}

# Function to start the application
start_app() {
    docker-compose up -d
    echo "Application started"
}

# Function to stop the application
stop_app() {
    docker-compose down
    echo "Application stopped"
}

# Function to view logs
view_logs() {
    docker-compose logs --tail=100 -f
}

# Main script logic
case "$1" in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        stop_app
        start_app
        ;;
    update-ip)
        check_and_update_ip
        ;;
    logs)
        view_logs
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|update-ip|logs}"
        exit 1
        ;;
esac
