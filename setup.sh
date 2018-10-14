#!/bin/sh
./destroy.sh

kubectl delete secret mysecret
kubectl apply -f ./secrets/secrets.yaml
kubectl delete secret db-user-pass
kubectl create secret generic db-user-pass --from-file=./secrets/db/

for filename in ls ./configs/* ]; do
    [ -e "$filename" ] || continue
    kubectl delete configmap ${filename##*/}
    kubectl create configmap ${filename##*/} --from-env-file=$filename
done

docker build ./sample-app -t internal-service-sample

kubectl apply -f ./external-service