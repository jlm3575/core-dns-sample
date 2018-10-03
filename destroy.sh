#!/bin/sh
kubectl delete deployment core-dns-sample-service
kubectl delete service core-dns-sample-service
kubectl delete service core-dns-sample-external
kubectl delete pods --all
