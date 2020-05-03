FROM php:7.3-cli

# Install node, npm , yarn
RUN docker-php-ext-install pcntl \
 && curl -sL https://deb.nodesource.com/setup_9.x | bash - \
 && apt-get update \
 && apt-get -y install nodejs git \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# && npm install -g yarn \
# && yarn

WORKDIR /home/ws/app

CMD ['sh', '-c', 'yarn start']
