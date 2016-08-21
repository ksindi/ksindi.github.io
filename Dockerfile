FROM python:3
MAINTAINER ksindi <kysindi@gmail.com>

# Update OS
RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get -y upgrade

# Install dependencies
RUN apt-get install -y make git tex-common texlive
# RUN easy_install pip
RUN pip install pelican markdown ghp-import
RUN pip install --upgrade pelican markdown ghp-import
# RUN git clone https://github.com/getpelican/pelican-plugins /site/

WORKDIR /site
# Need to mount /site/content
CMD pelican content/ -o output/ -s publishconf.py
