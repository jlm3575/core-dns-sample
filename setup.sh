#!/bin/sh
./destroy.sh

docker build ./sample-app -t core-dns-sample

kubectl apply -f ./external-service
