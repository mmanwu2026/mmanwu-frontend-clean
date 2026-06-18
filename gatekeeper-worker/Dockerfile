# Use Node 20 (required for Next.js 16+ and modern tooling)
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the worker code
COPY . .

# Build TypeScript → JavaScript
RUN npm run build

# Start the worker
CMD ["npm", "run", "start"]
