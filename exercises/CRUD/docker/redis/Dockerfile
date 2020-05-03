FROM redis:5.0

RUN apt-get update \
    && apt-get -y install iputils-ping \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
