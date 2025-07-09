# Stage 1: Build the Bun application
# FROM oven/bun:latest AS client-builder
FROM node:20-alpine AS client-builder

# Set your working directory inside the container
WORKDIR /app

# Copy your application files into the container
COPY . .

# Install dependencies using Bun's package manager
# RUN bun install --frozen-lockfile
RUN npm install

# RUN bun run build:client:prod
# RUN bun x vite build --mode production
# for some reason bun stalls on the vite build step, so we use npx vite instead
RUN npx vite build --mode production

# Stage 2: Build the Go application
FROM golang:1.23-alpine AS server-builder

WORKDIR /app

# Copy go.mod and go.sum to leverage Docker's build cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Copy the built client files from the Bun stage
COPY --from=client-builder /app/dist-ui ./dist-ui

# Build the Go binary
# CGO_ENABLED=0 disables cgo, resulting in a statically linked binary
# GOOS=linux ensures the binary is built for Linux, even if building on a different OS
RUN CGO_ENABLED=0 GOOS=linux go build -o partman .

# Stage 3: Create the final, minimal runtime image
FROM linuxcontainers/debian-slim:latest
ARG PARTMAN_ADMIN_EMAIL=partman@example.com
ARG PARTMAN_ADMIN_PASSWORD=admin

ARG PARTMAN_USER_EMAIL
ARG PARTMAN_USER_PASSWORD
ARG PARTMAN_USER_USERNAME

ENV PARTMAN_USER_EMAIL=${PARTMAN_USER_EMAIL}
ENV PARTMAN_USER_PASSWORD=${PARTMAN_USER_PASSWORD}
ENV PARTMAN_USER_USERNAME=${PARTMAN_USER_USERNAME}

WORKDIR /app

# Install ca-certificates for HTTPS support if needed
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates

# uncomment to copy the local migrations dir into the image
COPY --from=server-builder /app/migrations /app/migrations

# uncomment to copy the local pb_hooks dir into the image
# COPY --from=server-builder /app/pb_hooks /app/pb_hooks

# Copy the built binary from the build stage
COPY --from=server-builder /app/partman .

EXPOSE 8092

RUN chmod +x ./partman

# Initialize the database and create the superuser
RUN ./partman superuser upsert $PARTMAN_ADMIN_EMAIL $PARTMAN_ADMIN_PASSWORD

# Define the command to run when the container starts
CMD ["./partman", "serve", "--http=0.0.0.0:8092"]