FROM php:7.2-fpm

# Install PHP extensions required for Symfony
RUN docker-php-ext-install pdo_mysql \
    && pecl install apcu \
    && pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && apt-get update \
    && apt-get install -y zlib1g-dev \
    && docker-php-ext-install zip \
    && docker-php-ext-enable apcu \
    && docker-php-ext-enable redis \
    && mkdir /.composer \
    && chown 1000:1000 /.composer/

# Provide actual composer-setup signature
ARG COMPOSER_SHA384

COPY ./docker/back/bdt.ini $PHP_INI_DIR/conf.d/bdt.ini

USER ${BACKEND_USER}

# Install composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php -r "if (hash_file('SHA384', 'composer-setup.php') === \$_ENV['COMPOSER_SHA384']) { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
    && php composer-setup.php --filename=composer \
    && php -r "unlink('composer-setup.php');" \
    && mv composer /usr/local/bin/composer

WORKDIR /usr/src/app/api

COPY ./apps/back/api /usr/src/app/api

RUN PATH=$PATH:/usr/src/app/vendor/bin:bin
