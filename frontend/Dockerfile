FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove any existing lock file and node_modules, then clean install
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install

# Copy the rest of the application

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]