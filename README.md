This sample deployment creates a simple ExternalName Service, a LoadBalancer Service, and a ReplicaSet with three pods runninng a simple Node application.

Once running, the Node application will listen for requests on the root path, and proxy the content of the ExternalName service. This demonstrates an exposed internal service that is able to access an external host using CoreDNS.

Inside each pod is a demonstration set of environment variables created from Kubernetes Configmaps using the "--from-env-file" switch. Files are stored as text in a set of key:value pairs. To further illustrate configuration mapping, one config map, app.properties, is mounted as the volume /etc/config on each container.

Kubernets secrets are demonstrated as well. Two simple sets of secrets are provided and exposed to each pod as ENV variables. Each set demonstrates a different way of creating secrets. All secrets are stored in the API server as plaintext at rest in etcd, and they are available to all admin users. For this effort, secrets are stored in source control, but please note that these secrets are demonstration data only.

Thanks to [Jonathan Campos](https://github.com/jonbcampos) for his [Kubernetes examples](https://github.com/jonbcampos/kubernetes-series).

### Prerequisites

1. Install [Docker](https://docs.docker.com/install/)
2. Install the [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
3. Setup a local Kubernetes cluster with [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/).
4. Ensure you are [running CoreDNS in Minikube](https://coredns.io/2017/04/28/coredns-for-minikube/).
5. Ensure you have enabled ingress in Minikube
   `minikube addons enable ingress`

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

### Inspect the Container Configuration and Secret Variables

Sample configurations and secrets were imported as part of container deployment. Each were injected into the Kubernetes API and then called to map the containers' environment at runtime. The setup script creates three config maps and two sets of secrets.

1. List and describe configuration maps imported into the Kubernetes API

   `kubectl get configmaps`

   ```
   NAME                      DATA   AGE
   app-env-file.properties   3      55m
   app.properties            4      55m
   ui.properties             4      55m
   ```

   `kubectl describe configmap app.properties`

   ```
   Name:         app.properties
   Namespace:    default
   Labels:       <none>
   Annotations:  <none>

   Data
   ====
   brands:
   ----
   3
   company:
   ----
   affinipay
   lawpay.enabled:
   ----
   true
   lawpay.enabled.mascot:
   ----
   unicorn
   Events:  <none>
   ```

2. List and describe secrets imported into the Kubernetes API

   `kubectl get secrets`

   ```
   NAME                  TYPE                                  DATA   AGE
   db-user-pass          Opaque                                2      57m
   default-token-rbcbj   kubernetes.io/service-account-token   3      3d
   mysecret              Opaque                                2      57m
   ```

   Inspect how secrets are presented by the API

   `kubectl describe secret mysecret`

   ```
   Name:         mysecret
   Namespace:    default
   Labels:       <none>
   Annotations:
   Type:         Opaque

   Data
   ====
   username:  5 bytes
   password:  12 bytes
   ```

   View secrets as yaml, but base64 encoded

   `kubectl get secret db-user-pass -o yaml`

   ```
   apiVersion: v1
   data:
     db-pass: TWpNNFprUkpVaWxSSkd0elpYST0=
     db-user: WkdKaFpHMXBiZz09
   kind: Secret
   metadata:
     creationTimestamp: 2018-10-15T16:37:56Z
     name: db-user-pass
     namespace: default
     resourceVersion: "109594"
     selfLink: /api/v1/namespaces/default/secrets/db-user-pass
     uid: ab9f5ef8-d098-11e8-a026-080027239c66
   type: Opaque
   ```

3. See all environment variables exposed inside the pods (_your pod name will slightly vary_)
   `kubectl exec -it my-internal-service-5557946c59-h24k8 -- env`

   Grep for any environment variable found in the ./configs files, or any secret found in the ./secrets files. Examples

   ```
   kubectl exec -it my-internal-service-58485bbcb9-8cdh5 -- env | grep user
   username=admin
   db-user.txt=dbadmin
   ```

   ```
   kubectl exec -it my-internal-service-58485bbcb9-8cdh5 -- env | grep mascot
   lawpay.enabled.mascot=unicorn
   ```

4. See the mounted config volume inside the pods (_your pod name will slightly vary_)

   ```
   kubectl exec -it my-internal-service-5557946c59-h24k8 -- ls /etc/config
   kubectl exec -it my-internal-service-5557946c59-h24k8 -- cat /etc/config/company
   kubectl exec -it my-internal-service-5557946c59-h24k8 -- cat /etc/config/brands
   ```

5. See the base64 encoded secrets created from YAML
   ```
   kubectl get secret mysecret -o yaml

    apiVersion: v1
    data:
      password: MWYyZDFlMmU2N2Rm
      username: YWRtaW4=
    kind: Secret
    metadata:
      annotations:
        kubectl.kubernetes.io/last-applied-configuration: |
          {"apiVersion":"v1","data":{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="},"kind":"Secret","metadata":{"annotations":{},"name":"mysecret","namespace":"default"},"type":"Opaque"}
      creationTimestamp: 2018-10-15T16:37:56Z
      name: mysecret
      namespace: default
      resourceVersion: "109592"
      selfLink: /api/v1/namespaces/default/secrets/mysecret
      uid: ab84051e-d098-11e8-a026-080027239c66
    type: Opaque
    ```

    `echo -n YWRtaW4= | base64`

    admin

6. See the base64 encoded secrets created from plain text files

   ```
   kubectl get secret db-user-pass -o yaml

    apiVersion: v1
    data:
      db-pass: TWpNNFprUkpVaWxSSkd0elpYST0=
      db-user: WkdKaFpHMXBiZz09
    kind: Secret
    metadata:
      creationTimestamp: 2018-10-15T16:37:56Z
      name: db-user-pass
      namespace: default
      resourceVersion: "109594"
      selfLink: /api/v1/namespaces/default/secrets/db-user-pass
      uid: ab9f5ef8-d098-11e8-a026-080027239c66
    type: Opaque
    ```

    `echo -n WkdKaFpHMXBiZz09 | base64`

    dbadmin