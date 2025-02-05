echo "--------- DLTERP DEPLOY FRONTEND ---------"
gcloud auth activate-service-account supsi-gitlab@dlterp.iam.gserviceaccount.com --key-file=gcloud_auth.json --project=dlterp
gcloud config set compute/zone "europe-west6-a"
gcloud config set project dlterp
gcloud compute instances start dlterp-dev
gcloud compute ssh supsi-gitlab@dlterp-dev \
  --quiet \
  --command="mv /home/supsi-gitlab/dlterp-frontend/.well-known /home/supsi-gitlab/.well-known.backup 2>/dev/null; true && rm -rf /home/supsi-gitlab/dlterp-frontend/* && mv home/supsi-gitlab/.well-known.backup /home/supsi-gitlab/dlterp-frontend/.well-known 2>/dev/null; true"

gcloud compute scp --recurse dlterp-frontend supsi-gitlab@dlterp-dev:~ --quiet
