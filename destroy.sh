#!/bin/sh
kubectl delete deployment my-internal-service
kubectl delete service my-internal-service
kubectl delete service my-external-service
kubectl delete ingress my-internal-service
kubectl delete pods --all
