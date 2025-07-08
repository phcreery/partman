FROM partman-build:latest AS build

FROM alpine:3.19

WORKDIR /app

# Install ca-certificates for HTTPS support if needed
RUN apk add --no-cache ca-certificates

# Copy the built binary from the build stage
COPY --from=build /app/partman .

# Expose the port your application listens on (e.g., for a web server)
EXPOSE 8092

RUN chmod +x ./partman

# Define the command to run when the container starts
CMD ["./partman", "serve", "--http=0.0.0.0:8092"]