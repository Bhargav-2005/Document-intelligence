# Challenge 1B Dockerfile - Persona-Driven Document Intelligence
FROM --platform=linux/amd64 node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for PDF processing
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Create input and output directories
RUN mkdir -p /app/input /app/output

# Set permissions
RUN chmod +x /app/process1b.js

# Set environment variables
ENV NODE_ENV=production
ENV USE_DUMMY=true

# Default command
CMD ["node", "main.js"]