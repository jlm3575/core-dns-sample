#!/bin/sh
./destroy.sh

docker build ./sample-app -t internal-service-sample

kubectl apply -f ./external-service
