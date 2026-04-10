# Base image
FROM node:18-alpine

# Mendefinisikan build argument dengan default placeholder agar build tidak crash
# Nilai asli akan di-override dari .env server saat runtime (docker run --env-file .env)
ARG NEXT_PUBLIC_BACKEND_API_BASEURL=http://localhost:3000
ARG NEXT_PUBLIC_GRECAPTCHA_SITE_KEY=placeholder
ARG GRECAPTCHA_SECRET_KEY=placeholder
ARG BACKEND_API_BASEURL=http://localhost:3000
ARG FRONTEND_URL=http://localhost:3000
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000

# Mengatur environment variables
ENV NEXT_PUBLIC_BACKEND_API_BASEURL=$NEXT_PUBLIC_BACKEND_API_BASEURL
ENV BACKEND_API_BASEURL=$BACKEND_API_BASEURL
ENV NEXT_PUBLIC_GRECAPTCHA_SITE_KEY=$NEXT_PUBLIC_GRECAPTCHA_SITE_KEY
ENV GRECAPTCHA_SECRET_KEY=$GRECAPTCHA_SECRET_KEY
ENV FRONTEND_URL=$FRONTEND_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_NEXTAUTH_URL=$NEXT_PUBLIC_NEXTAUTH_URL

# Debug environment variables sebelum build
RUN echo "NEXT_PUBLIC_BACKEND_API_BASEURL=$NEXT_PUBLIC_BACKEND_API_BASEURL"
RUN echo "BACKEND_API_BASEURL=$BACKEND_API_BASEURL"
RUN echo "NEXT_PUBLIC_GRECAPTCHA_SITE_KEY=$NEXT_PUBLIC_GRECAPTCHA_SITE_KEY"
RUN echo "GRECAPTCHA_SECRET_KEY=$GRECAPTCHA_SECRET_KEY"
RUN echo "FRONTEND_URL=$FRONTEND_URL"
RUN echo "NEXTAUTH_URL=$NEXTAUTH_URL"
RUN echo "NEXT_PUBLIC_NEXTAUTH_URL=$NEXT_PUBLIC_NEXTAUTH_URL"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Expose port
# EXPOSE 3000

# Start the app
CMD ["npm", "start"]
