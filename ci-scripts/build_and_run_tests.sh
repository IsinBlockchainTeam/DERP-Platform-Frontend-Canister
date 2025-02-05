#!/bin/bash

IMAGE_NAME=gitlab-core.supsi.ch:5050/dti-isin/giuliano.gremlich/blockchain/dlt-erp/dlterp-registry/dlterp-web-app-tests
docker login -u $CI_REGISTRY_USER -p $DLTERP_DOCKER_REGISTRY_TOKEN gitlab-core.supsi.ch:5050/dti-isin/giuliano.gremlich/blockchain/dlt-erp/dlterp-registry

# Try to pull the image
docker pull $IMAGE_NAME || {
  # If the image is not found, build the image
  docker build . -f docker/DlterpFrontendTestsDockerfile -t $IMAGE_NAME
  docker push $IMAGE_NAME
}

# Run the container
docker run dlterp-web-app-tests 2>&1