#!/usr/bin/env bash
#sudo docker build -t pelican .
docker pull ksindi/pelican
docker run -t --name=pelican-run -v $(pwd):/site ksindi/pelican
docker rm pelican-run