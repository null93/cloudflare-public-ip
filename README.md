# Cloudflare — Public IP
> Container to periodically update public IP address with a Cloudflare DNS record

![MIT License](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=for-the-badge)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-lightgrey.svg?style=for-the-badge)
![Stars](https://img.shields.io/docker/stars/null93/cloudflare-public-ip.svg?style=for-the-badge&colorB=9f9f9f)
![Pulls](https://img.shields.io/docker/pulls/null93/cloudflare-public-ip.svg?style=for-the-badge&colorB=9f9f9f)

### About

This project aims to provide a docker image that can be used to update an A record through Cloudflare's API. The value would be the external (public) IP address relative to the running container. Why would this be important? If you ever wanted to run a home-lab with a dynamic IP address, then this can be used to periodically ensure that said IP address is saved to a given Cloudflare A record.

### Environmental Variables

|      **Key**      | **Required** | **Default** | **Type** |      **Description**      |
|:-----------------:|:------------:|:-----------:|:--------:|:-------------------------:|
|      CF_DEBUG     |      No      |    false    |   bool   |    Display debug info?    |
|      CF_ZONE      |      Yes     |      -      |  string  |     Cloudflare Zone ID    |
|      CF_TOKEN     |      Yes     |      -      |  string  |    Cloudflare API token   |
|   CF_RECORD_NAME  |      Yes     |      -      |  string  |       A record name       |
| CF_RECORD_PROXIED |      No      |     true    |   bool   | Proxy through Cloudflare? |
|   CF_RECORD_TTL   |      No      |      1      |    int   |      TTL for A record     |

### Example (Docker)

```shell
docker run -it \
    -e CF_DEBUG="true" \
    -e CF_ZONE="Sm8k6RYi0yHfsb6AyIIBVdb2AaJ6IX1y" \
    -e CF_TOKEN="TzpPptgsMSTrhVWzg9J9XjYJ6G91kr9yhPeTEwkf" \
    -e CF_RECORD_NAME="foo.example.com" \
    -e CF_RECORD_PROXIED="true" \
    -e CF_RECORD_TTL="1" \
    null93/cloudflare-public-ip
```

### Example (CronJob)

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
    name: comcast-foo
spec:
    schedule: "*/1 * * * *"
    jobTemplate:
        spec:
            template:
                spec:
                    restartPolicy: OnFailure
                    containers:
                    -   name: comcast-foo
                        image: null93/cloudflare-public-ip
                        imagePullPolicy: IfNotPresent
                        env:
                        -   name: CF_DEBUG
                            value: "false"
                        -   name: CF_ZONE
                            value: "Sm8k6RYi0yHfsb6AyIIBVdb2AaJ6IX1y"
                        -   name: CF_TOKEN
                            value: "TzpPptgsMSTrhVWzg9J9XjYJ6G91kr9yhPeTEwkf"
                        -   name: CF_RECORD_NAME
                            value: "foo.example.com"
                        -   name: CF_RECORD_PROXIED
                            value: "true"
                        -   name: CF_RECORD_TTL
                            value: "1"
```

### Docker Build & Push

```shell
docker build -t null93/cloudflare-public-ip:latest .
docker push null93/cloudflare-public-ip:latest
```
