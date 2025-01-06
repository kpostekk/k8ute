> [!NOTE]
> This is a PoC setup for WireGuard VPN peer to expose resources in a Kubernetes cluster. This is not a production-ready setup and should be used for testing and development purposes only.

## Prerequisites
 - A WireGuard VPN server with IP forwarding enabled.
 - `kublet`/`minikube` with sysctls enabled (`minikube start --driver=docker --container-runtime=containerd --cni=calico --extra-config="kubelet.allowed-unsafe-sysctls=net.*"`)
 - Calico CNI is *recommended*

## Setup

1. Create a peer config for the VPN server and the peer node (`peer0.conf`)

```conf
[Interface]
Address = 10.13.13.2
PrivateKey = {peer_private_key}
ListenPort = 51820
DNS = 10.13.13.1


[Peer]
PublicKey = {server_public_key}
PresharedKey = {preshared_key}
Endpoint = vpn.k8ute.local:51820
AllowedIPs = 10.13.13.0/24
```

2. Alter server config (`wg0.conf`) to include kubernetes cluster CIDR.

```conf
[Interface]
Address = 10.13.13.1
ListenPort = 51820
PrivateKey = {server_private_key}
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth+ -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth+ -j MASQUERADE

[Peer]
# peer0 (k8s node)
PublicKey = {peer_public_key}
PresharedKey = {preshared_key}
AllowedIPs = 10.13.13.2/32,10.0.0.0/8 # k8s cluster CIDR

[Peer]
# peer1 (user/challenger)
PublicKey = {peer_public_key}
PresharedKey = {preshared_key}
AllowedIPs = 10.13.13.3/32
```

3. Alter peer config (`peer0.conf`) to enable IP forwarding.

```conf
[Interface]
Address = 10.13.13.2
PrivateKey = {peer_private_key}
ListenPort = 51820
DNS = 10.13.13.1
# THOSE TWO LINES ARE IMPORTANT
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth+ -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth+ -j MASQUERADE


[Peer]
PublicKey = {server_public_key}
PresharedKey = {preshared_key}
Endpoint = vpn.k8ute.local:51820
AllowedIPs = 10.13.13.0/24
```

4. While creating other peers conf, ensure that the `AllowedIPs` includes the peer's IP and the k8s cluster CIDR.
```conf
[Interface]
Address = 10.13.13.3
PrivateKey = {peer_private_key}
ListenPort = 51820
DNS = 10.13.13.1

[Peer]
PublicKey = {server_public_key}
PresharedKey = {preshared_key}
Endpoint = vpn.k8ute.local:51820
AllowedIPs = 10.13.13.0/24,10.0.0.0/8 # vpn subnet + k8s cluster CIDR
```

## Deploying WireGuard in Kubernetes

1. Modify `wireguard-secret.yaml` to include peer config.

    ```bash
    cat peer0.conf | base64 -w0
    ```

    ...then replace the `peer0.conf` value in `wireguard-secret.yaml`.

2.  ```bash
    kubectl apply -f wireguard-secret.yaml -f wireguard.yaml
    ```

3. Check connection to server.

    ```bash
    kubectl exec --stdin -n wireguard --tty wireguard -- /bin/bash

    ping 1.1.1.1 # check internet connectivity

    ping 10.13.13.1 # check connection to server
    ```

## Example VPN Server

> [!TIP]
> This is modified example of the [linuxserver/wireguard](https://hub.docker.com/r/linuxserver/wireguard).

```yaml
services:
  wireguard:
    image: lscr.io/linuxserver/wireguard:latest
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE #optional
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - SERVERURL=vpn.k8ute.local # modify this
      - SERVERPORT=51820
      - PEERS=cluster,guest1,guest2 # modify this
      - PEERDNS=auto
      - INTERNAL_SUBNET=10.13.13.0
      - PERSISTENTKEEPALIVE_PEERS=10
      - LOG_CONFS=true
      - SERVER_ALLOWEDIPS_PEER_kluster=10.0.0.0/8
    volumes:
      - ./config:/config
      - /lib/modules:/lib/modules
    ports:
      - 51820:51820/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
    restart: unless-stopped
```

This can be deployed using classic `docker compose up -d`.

## Troubleshooting

To check if VPN is connected start by pinging the VPN server from the peer node.

```bash
ping 10.13.13.1
```

If the ping is successful, try pinging the k8s API server.

```bash
ping 10.13.13.2
```

After that we can try traceroute the WireGuard pod.

```bash
$ kubectl get pods -o wide -n wireguard
NAME                                READY   STATUS    RESTARTS   AGE   IP               NODE       NOMINATED NODE   READINESS GATES
wireguard-client-6db8955ccf-5nncc   1/1     Running   0          40m   10.244.120.102   minikube   <none>           <none>

$ traceroute 10.244.120.102
traceroute to 10.244.120.102 (10.244.120.102), 30 hops max, 60 byte packets
 1  10.13.13.1 (10.13.13.1)  0.976 ms  0.989 ms  1.012 ms
 2  10.244.120.102 (10.244.120.102)  1.834 ms  1.872 ms  1.878 ms
```

If the traceroute was successful, we can can assume IP forwarding is working correctly on the server node.

Now try tracerouting  other pods in the cluster.


```bash
$ kubectl get pods -o wide -A
NAMESPACE                                    NAME                                        READY   STATUS    RESTARTS      AGE    IP               NODE       NOMINATED NODE   READINESS GATES
k8ute-1663a2f5-02ea-4a81-8212-96d5a01d975f   operator-8597dbfffc-4vx87                   1/1     Running   0             35m    10.244.120.107   minikube   <none>           <none>
k8ute-1663a2f5-02ea-4a81-8212-96d5a01d975f   source-5747bc964d-n87sv                     1/1     Running   0             35m    10.244.120.108   minikube   <none>           <none>
kube-system                                  calico-kube-controllers-7fbd86d5c5-2tfdn    1/1     Running   1 (99m ago)   160m   10.244.120.89    minikube   <none>           <none>
kube-system                                  calico-node-9vq5r                           1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  coredns-6f6b679f8f-2c5jl                    1/1     Running   1 (99m ago)   160m   10.244.120.90    minikube   <none>           <none>
kube-system                                  etcd-minikube                               1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  kube-apiserver-minikube                     1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  kube-controller-manager-minikube            1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  kube-proxy-bxzf4                            1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  kube-scheduler-minikube                     1/1     Running   1 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kube-system                                  storage-provisioner                         1/1     Running   2 (99m ago)   160m   192.168.49.2     minikube   <none>           <none>
kubernetes-dashboard                         dashboard-metrics-scraper-c5db448b4-klvzk   1/1     Running   1 (99m ago)   159m   10.244.120.91    minikube   <none>           <none>
kubernetes-dashboard                         kubernetes-dashboard-695b96c756-zxj7r       1/1     Running   1 (99m ago)   159m   10.244.120.92    minikube   <none>           <none>
wireguard                                    wireguard-client-6db8955ccf-5nncc           1/1     Running   0             43m    10.244.120.102   minikube   <none>           <none>

$ traceroute  10.244.120.107
traceroute to 10.244.120.107 (10.244.120.107), 30 hops max, 60 byte packets
 1  10.13.13.1 (10.13.13.1)  1.065 ms  1.067 ms  1.117 ms
 2  10.13.13.2 (10.13.13.2)  1.874 ms  2.111 ms  2.111 ms
 3  * * *
 4  10.244.120.107 (10.244.120.107)  2.155 ms  2.213 ms  2.230 ms
```

If the traceroute was successful, we can can assume IP forwarding is working correctly on the peer node.

At this point we can try accessing the services running in the cluster/

```bash
$ kubectl get services -n k8ute-1663a2f5-02ea-4a81-8212-96d5a01d975f
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
mariadb      ClusterIP   10.107.145.217   <none>        3306/TCP   56s
phpmyadmin   ClusterIP   10.98.117.35     <none>        80/TCP     56s
wordpress    ClusterIP   10.98.71.116     <none>        80/TCP     56s

$ curl --head 10.98.117.35
HTTP/1.1 200 OK
Date: Mon, 06 Jan 2025 15:43:35 GMT
Server: Apache/2.4.62 (Debian)
X-Powered-By: PHP/8.2.27
Set-Cookie: phpMyAdmin=4e461fd3f203b8e7ae829d5dee8458c1; path=/; HttpOnly; SameSite=Strict
# truncated
```
