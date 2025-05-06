FROM ubuntu:22.04

# Install required system packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    supervisor

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Create app directory
WORKDIR /usr/src/app

# Copy and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy and install frontend dependencies, then build React app
COPY client/package*.json ./client/
RUN cd client && npm install

ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy the rest of the application code
COPY . .

RUN cd client && npm run build

# Download and install phoenixd daemon
RUN wget https://github.com/ACINQ/phoenixd/releases/download/v0.4.2/phoenix-0.4.2-linux-x64.zip \
    && unzip -j phoenix-0.4.2-linux-x64.zip -d /usr/local/bin/ \
    && chmod +x /usr/local/bin/phoenixd \
    && rm phoenix-0.4.2-linux-x64.zip

# Make sure the startup script is executable
RUN chmod +x /usr/src/app/start.sh

# Expose port (adjust if backend serves frontend or multiple ports needed)
EXPOSE 32400

CMD ["/usr/src/app/start.sh"]

