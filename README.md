# small-IOT-app
samll app for reciving IOT info and storing in custom db

## useage of `dev.sh`:
 - `./dev.sh dev`: Start the development environment
 - `./dev.sh build`: Build the project
 - `./dev.sh test`: Run tests
 - `./dev.sh deploy`: Deploy the project using Docker Compose

## todo:
 - [ ] sepret routes and the other thing in backend
 - [ ] make hook for auth
 - [ ] make tests
 - [ ] check if docker is set properly
 - [ ] check the lets encrypt things
 - [ ] check if anything works

# Deployment guide

This guide provides detailed instructions for setting up the IoT Dashboard, including network configuration, automatic SSL certificate generation, and easy management scripts.

## Table of Contents

1. [Hardware Requirements](#hardware-requirements)
2. [Software Prerequisites](#software-prerequisites)
3. [Network Configuration](#network-configuration)
4. [Dynamic DNS Setup](#dynamic-dns-setup)
5. [Server Setup](#server-setup)
6. [Traefik and SSL Configuration](#traefik-and-ssl-configuration)
7. [Application Deployment](#application-deployment)
8. [Management Scripts](#management-scripts)
9. [IoT Device Configuration](#iot-device-configuration)
10. [Troubleshooting](#troubleshooting)

## Hardware Requirements

- A computer or laptop with at least 2GB of RAM and 20GB of free storage
- A stable internet connection

## Software Prerequisites

1. Install Docker and Docker Compose:
   ```
   sudo apt-get update
   sudo apt-get install docker.io docker-compose
   ```

2. Install Git:
   ```
   sudo apt-get install git
   ```

## Network Configuration

1. Assign a static IP to your server within your local network:
   - Open `/etc/netplan/01-netcfg.yaml` (create if it doesn't exist)
   - Add the following content (adjust according to your network):
     ```yaml
     network:
       version: 2
       renderer: networkd
       ethernets:
         eth0:
           dhcp4: no
           addresses:
             - 192.168.1.100/24
           gateway4: 192.168.1.1
           nameservers:
             addresses: [8.8.8.8, 8.8.4.4]
     ```
   - Apply the changes: `sudo netplan apply`

2. Configure port forwarding on your router:
   - Access your router's admin panel (usually http://192.168.1.1 or http://192.168.0.1)
   - Find the "Port Forwarding" or "Virtual Server" section
   - Add new rules:
     - HTTP: External Port 80 -> Internal Port 80, TCP, Server IP 192.168.1.100
     - HTTPS: External Port 443 -> Internal Port 443, TCP, Server IP 192.168.1.100

3. (Optional) Configure UPnP on your router if available for automatic port forwarding

## Dynamic DNS Setup

1. Sign up for a free Dynamic DNS service (e.g., DuckDNS)
2. Create a domain (e.g., myiotdashboard.duckdns.org)
3. Note down your domain and token for later use

## Server Setup

1. Clone the repository:
   ```
   git clone https://github.com/radoslaw-wolnik/iot-dashboard.git
   cd iot-dashboard
   ```

2. Create a `.env` file in the project root:
   ```
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_db_password
   POSTGRES_DB=iot_dashboard
   JWT_SECRET=your_jwt_secret
   DOMAIN_NAME=your_duckdns_domain
   DUCKDNS_TOKEN=your_duckdns_token
   ```

## Traefik and SSL Configuration

1. Create a `traefik.toml` file in the project root:
   ```toml
   [entryPoints]
     [entryPoints.web]
       address = ":80"
       [entryPoints.web.http.redirections.entryPoint]
         to = "websecure"
         scheme = "https"
     [entryPoints.websecure]
       address = ":443"

   [certificatesResolvers.myresolver.acme]
     email = "your-email@example.com"
     storage = "acme.json"
     [certificatesResolvers.myresolver.acme.httpChallenge]
       entryPoint = "web"

   [providers.docker]
     watch = true
     network = "web"

   [api]
     dashboard = true
   ```

2. Create an empty `acme.json` file and set proper permissions:
   ```
   touch acme.json
   chmod 600 acme.json
   ```

3. Update your `docker-compose.yml` to include Traefik:
   ```yaml
   version: '3'

   services:
     traefik:
       image: traefik:v2.4
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
         - ./traefik.toml:/traefik.toml
         - ./acme.json:/acme.json
       networks:
         - web
       labels:
         - "traefik.enable=true"
         - "traefik.http.routers.dashboard.rule=Host(`${DOMAIN_NAME}`) && (PathPrefix(`/api`) || PathPrefix(`/dashboard`))"
         - "traefik.http.routers.dashboard.entrypoints=websecure"
         - "traefik.http.routers.dashboard.tls.certresolver=myresolver"

     frontend:
       build: ./frontend
       labels:
         - "traefik.enable=true"
         - "traefik.http.routers.frontend.rule=Host(`${DOMAIN_NAME}`)"
         - "traefik.http.routers.frontend.entrypoints=websecure"
         - "traefik.http.routers.frontend.tls.certresolver=myresolver"
       networks:
         - web

     backend:
       build: ./backend
       environment:
         - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
         - JWT_SECRET=${JWT_SECRET}
       networks:
         - web
         - internal

     db:
       image: postgres:13
       environment:
         - POSTGRES_USER=${POSTGRES_USER}
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
         - POSTGRES_DB=${POSTGRES_DB}
       volumes:
         - pgdata:/var/lib/postgresql/data
       networks:
         - internal

   networks:
     web:
       external: true
     internal:

   volumes:
     pgdata:
   ```

4. Create the external network:
   ```
   docker network create web
   ```

## Application Deployment

1. Start the application:
   ```
   ./manage.sh start
   ```

2. Access your IoT Dashboard at `https://your-domain.duckdns.org`

3. Create an admin account through the web interface

## Management Scripts

1. Make the management script executable:
   ```
   chmod +x manage.sh
   ```

2. Use the script for common tasks:
   - Start the application: `./manage.sh start`
   - Stop the application: `./manage.sh stop`
   - Restart the application: `./manage.sh restart`
   - Update IP and DDNS: `./manage.sh update-ip`
   - View logs: `./manage.sh logs`

3. Set up a cron job to regularly update the IP:
   ```
   crontab -e
   ```
   Add the following line to run every 5 minutes:
   ```
   */5 * * * * /path/to/your/project/manage.sh update-ip
   ```

## IoT Device Configuration

Configure your IoT devices to send data to `https://your-domain.duckdns.org/api/data/:tableId`. Use the API key obtained from the dashboard for authentication.

Example Python script for an IoT device:

```python
import requests
import time

API_KEY = "your_device_api_key"
TABLE_ID = "your_table_id"
DASHBOARD_URL = "https://your-domain.duckdns.org"

def send_data(temperature, humidity):
    url = f"{DASHBOARD_URL}/api/data/{TABLE_ID}"
    headers = {"X-API-Key": API_KEY}
    data = {"temperature": temperature, "humidity": humidity}
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        print("Data sent successfully")
    except requests.exceptions.RequestException as e:
        print(f"Error sending data: {e}")

while True:
    # Replace this with actual sensor readings
    temperature = 25.5
    humidity = 60.0
    
    send_data(temperature, humidity)
    time.sleep(60)  # Send data every minute
```

## Troubleshooting

1. **SSL certificate issues:**
   - Ensure ports 80 and 443 are properly forwarded
   - Check Traefik logs: `docker-compose logs traefik`
   - Verify that your domain is pointing to the correct IP

2. **Cannot access the dashboard:** 
   - Check if all containers are running: `docker-compose ps`
   - Verify your firewall settings: `sudo ufw status`

3. **IoT devices can't connect:**
   - Ensure devices are using HTTPS
   - Verify the API key and Table ID
   - Check if devices can resolve the domain name

4. **Data not showing up in the dashboard:**
   - Check backend logs: `docker-compose logs backend`
   - Verify that the data format matches the table schema

5. **IP not updating:**
   - Run the update script manually: `./manage.sh update-ip`
   - Check if the cron job is set up correctly: `crontab -l`

For any other issues, check the application logs or consult the project's issue tracker on GitHub.