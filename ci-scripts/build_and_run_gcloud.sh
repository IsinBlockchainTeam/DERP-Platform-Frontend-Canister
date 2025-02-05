#!/bin/bash

cp $GCLOUD_AUTH gcloud_auth.json
docker build . -f docker/DlterpFrontendBuildDockerfile -t dlterp-frontend-build
docker run -v ./build:/build dlterp-frontend-build 2>&1

# compress and push the built archive to package registry
tar -czvf build.tar.gz build
apk add --update curl

echo "Uploading build to package registry: " $CI_SERVER_HOST $CI_PROJECT_ID
curl --fail-with-body --header "JOB-TOKEN: $CI_JOB_TOKEN" \
  --upload-file build.tar.gz \
  ${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/web-app-frontend/latest/web-app-frontend.tar.gz?status=default

if [ $? -eq 0 ]; then
  echo "Build uploaded successfully"
else
  echo "Failed to upload build"
  exit 1
fi

docker build . -f docker/DlterpFrontendGcloudDockerfile -t dlterp-frontend-gcloud
docker run dlterp-frontend-gcloud 2>&1