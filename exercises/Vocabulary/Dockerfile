FROM php:7.3-cli

# Install node, npm , yarn
RUN docker-php-ext-install pcntl \
 && apt-get update \
 && apt-get -y install git \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /home/ws/app
