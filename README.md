This sample deployment creates a simple ExternalName Service, a LoadBalancer Service, and a ReplicaSet with three pods runninng a simple Node application.

Once running, the Node application will listen for requests on the root path, and proxy the content of the ExternalName service. This demonstrates an exposed internal service that is able to access an external host using CoreDNS.

Thanks to [Jonathan Campos](https://github.com/jonbcampos) for his [Kubernetes examples](https://github.com/jonbcampos/kubernetes-series).

### Prerequisites

1. Install [Docker](https://docs.docker.com/install/)
2. Install the [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
3. Setup a local Kubernetes cluster with [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/).
4. Ensure you are [running CoreDNS in Minikube](https://coredns.io/2017/04/28/coredns-for-minikube/).

### Running the Deployment

1. Run the following command in any new terminal window to support local Docker images with Minikube.

   `eval $(minikube docker-env)`
2. Run the setup script

   `./setup.sh`

   _This will run the destroy script first, so comment that out if it's not desired. I'm working on a better way._
3. Ensure the pods are running

   `kubectl get pods`

4. Verify via logs that our service is running properly (_your pod name will slightly vary_)

   `kubectl logs --follow my-internal-service-55d6c4bcc7-8bpvz`

   You should see the line `Example app listening on port 3000!`

5. Add a host mapping for our service in `/etc/hosts`

   Get your Minikube host IP using `minikube ip`

   `[minikube-ip] external-service-sample.internal`

6. Ensure our load balancer is running. This command should open in browser showing the contents of external url. Note the IP is the Minikube IP, and remember the port.

   `minikube service my-internal-service`

7. Inspect our load balancer. Note that the NodePort value matches the port we saw in step 7.

   `kubectl describe service my-internal-service`

8. Visit our internal service in a browser using its ingress host. This should produce the same content as

   `http://external-service-sample.internal`


### Inspect the Moving Parts of the Deployment

1. Get Kubernetes objects by type

   `kubectl get _OBJECT_TYPE_` where the type is one of _deployments_, _services_, or _pods_

2. Inspect the properties of an object

   `kubectl describe _OBJECT_NAME_` where the name is the first column in one of the output rows from the above `get` command (_your pod name will slightly vary_)

3. Run commands on a Pod

   `kubectl exec my-internal-service-55d6c4bcc7-8bpvz cat /etc/hostname`

4. See ReplicaSet Pods respawn (_your pod name will slightly vary_)

   `kubectl delete pod my-internal-service-55d6c4bcc7-8bpvz` will terminate the pod

   `kubectl get pods` will show one terminating and another starting
