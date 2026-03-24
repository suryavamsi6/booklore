#!/bin/bash
set -euo pipefail

# =======================
# Multi-arch Docker Build & Push for Booklore
# =======================

# Ensure a version/tag is passed
if [ -z "${1:-}" ]; then
  echo "ERROR: You must provide a version/tag as the first argument."
  echo "Usage: $0 <version-tag>"
  exit 1
fi

VERSION="$1"

echo "Building Booklore App with multi-arch version: $VERSION"

# Authenticate to GitHub Container Registry
if [ -z "${CR_PAT:-}" ]; then
  echo "ERROR: Set CR_PAT environment variable with a GitHub personal access token (write:packages scope)."
  exit 1
fi
echo "$CR_PAT" | docker login ghcr.io -u "${GITHUB_USER:-suryavamsi6}" --password-stdin

# Ensure Docker Buildx builder exists and is used
docker buildx create --use --name multiarch-builder || true

# Build and push multi-arch Docker image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/suryavamsi6/booklore:"$VERSION" \
  --push \
  .

echo "Multi-arch Docker image ghcr.io/suryavamsi6/booklore:$VERSION pushed successfully!"