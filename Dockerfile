# Stage 0: Build the Bun application
# FROM oven/bun AS client-builder
FROM node:20-alpine AS client-builder

# Set your working directory inside the container
WORKDIR /app

# Copy your application files into the container
COPY . .

# Install dependencies using Bun's package manager
# RUN bun install
RUN npm install

# RUN bun build:client:prod
# RUN bun x vite build --mode production
# for some reason bun stalls on the vite build step, so we use npx vite instead
RUN npx vite build --mode production

# Stage 1: Build the Go application
FROM golang:1.22-alpine AS server-builder

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

# Stage 2: Create the final, minimal runtime image
FROM alpine:3.19

WORKDIR /app

# Install ca-certificates for HTTPS support if needed
RUN apk add --no-cache ca-certificates

# Copy the built binary from the server-builder stage
COPY --from=server-builder /app/partman .

# Expose the port your application listens on (e.g., for a web server)
EXPOSE 8092

# Define the command to run when the container starts
CMD ["./partman", "serve", "--http=0.0.0.0:8092"]