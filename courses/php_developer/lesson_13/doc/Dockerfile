FROM php:7.2-apache
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer
RUN apt-get update
RUN apt-get install -y git
WORKDIR /app