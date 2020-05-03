FROM mysql:5.7

RUN apt-get update \
    && apt-get install -y iputils-ping

COPY ./data.sql /data/