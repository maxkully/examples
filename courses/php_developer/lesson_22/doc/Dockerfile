FROM php:7.2-apache
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y sqlite3 libsqlite3-dev
RUN mkdir /db
RUN chgrp -R /db
RUN chgrp -R www-data /var/www/html

WORKDIR /app