#

FROM alpine:3.6

ARG POCKETBASE_VERSION=0.5.1

# Install the dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    zip \
    zlib-dev \
    curl \
    jq

# Download Pocketbase and install it for AMD64
ADD https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip /tmp/pocketbase.zip
RUN unzip /tmp/pocketbase.zip -d /usr/local/bin/
RUN chmod +x /usr/local/bin/pocketbase

# Download partman ad copy DB template and dist folter to PocketBase directories
RUN mkdir /usr/local/bin/pb_public
RUN mkdir /usr/local/bin/pb_data
RUN PARTMAN_PUBLIC_DOWNLOAD_URL=$(curl -s https://api.github.com/repos/phcreery/partman/releases/latest \
    | jq -r '.assets[] | select(.name | contains(".zip")) | .browser_download_url') && \
    echo "$PARTMAN_PUBLIC_DOWNLOAD_URL" && \
    echo "$PARTMAN_PUBLIC_DOWNLOAD_URL" | wget -qi - -O /tmp/partman.zip
RUN DB_PUBLIC_DOWNLOAD_URL=$(curl -s https://api.github.com/repos/phcreery/partman/releases/latest \
    | jq -r '.assets[] | select(.name | contains(".db")) | .browser_download_url') && \
    echo "$DB_PUBLIC_DOWNLOAD_URL" && \
    echo "$DB_PUBLIC_DOWNLOAD_URL" | wget -qi - -O /tmp/data.db
RUN unzip /tmp/partman.zip -d /tmp/partman
RUN cp -r /tmp/partman/* /usr/local/bin/pb_public
RUN cp /tmp/data.db /usr/local/bin/pb_data
RUN cd /usr/local/bin

# Notify Docker that the container wants to expose a port.
EXPOSE 8090

# Start Pocketbase
WORKDIR /usr/local/bin
CMD [ "/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8090" ]
