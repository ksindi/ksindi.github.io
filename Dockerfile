FROM python:3
MAINTAINER ksindi <kysindi@gmail.com>

# Update OS
RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get -y upgrade

# Install dependencies
RUN apt-get install -y make git tex-common texlive
ADD requirements.txt /
RUN pip install -r requirements.txt

WORKDIR /site
# Need to mount /site/content
CMD pelican content/ -o output/ -s publishconf.py

# docker login
# docker build -t ksindi/pelican .
# docker push ksindi/pelican
