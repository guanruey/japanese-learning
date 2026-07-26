FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install ONLY production dependencies (skip devDependencies like vite, playwright, etc.)
RUN npm ci --omit=dev

# Bundle app source (only the backend files needed)
COPY server.js .
COPY server/ ./server/

# If you have other backend folders needed, copy them here
# e.g., COPY src/supabase.js ./src/

# Expose port (Google Cloud Run expects the app to listen on process.env.PORT, default 8080)
ENV PORT=8080
EXPOSE 8080

# Command to run the Express server
CMD [ "node", "server.js" ]
