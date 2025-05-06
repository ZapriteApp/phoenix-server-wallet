#!/bin/bash

printf "\n\n[i] Starting Phoenixd wallet application...\n\n"

CONF_FILE="/root/.phoenix/phoenix.conf"
ENV_FILE="/usr/src/app/backend/.env"

# Add environment variables
echo "PHOENIX_API_URL=http://127.0.0.1:9740" >> $ENV_FILE
echo "Values copied to $ENV_FILE."

# Start the phoenixd daemon
echo "Starting phoenixd daemon..."
/usr/local/bin/phoenixd &
sleep 1
chmod -R 755 /root/.phoenix
ls /root/.phoenix

# Start the backend Node.js application
echo "Starting Node.js backend..."
cd /usr/src/app/backend
node server.js
