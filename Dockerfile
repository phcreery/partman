FROM phcreery/partman-build:latest AS build

FROM alpine:3.19
ARG PARTMAN_ADMIN_EMAIL
ARG PARTMAN_ADMIN_PASSWORD

ARG PARTMAN_USER_EMAIL
ARG PARTMAN_USER_PASSWORD
ARG PARTMAN_USER_USERNAME

ENV PARTMAN_USER_EMAIL=${PARTMAN_USER_EMAIL}
ENV PARTMAN_USER_PASSWORD=${PARTMAN_USER_PASSWORD}
ENV PARTMAN_USER_USERNAME=${PARTMAN_USER_USERNAME}

WORKDIR /app

# Install ca-certificates for HTTPS support if needed
RUN apk add --no-cache ca-certificates

# Copy the built binary from the build stage
COPY --from=build /app/partman .

# Expose the port your application listens on (e.g., for a web server)
EXPOSE 8092

RUN chmod +x ./partman
RUN ./partman superuser upsert $PARTMAN_ADMIN_EMAIL $PARTMAN_ADMIN_PASSWORD

# Define the command to run when the container starts
CMD ["./partman", "serve", "--http=0.0.0.0:8092"]