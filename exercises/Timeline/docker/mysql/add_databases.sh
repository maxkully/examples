#!/bin/bash

file_env 'MY_DB_NAME'
if [ "$MY_DB_NAME" ]; then
    echo "CREATE DATABASE IF NOT EXISTS \`$MY_DB_NAME\` CHARACTER SET utf8 COLLATE utf8_general_ci;" | "${mysql[@]}"
fi

file_env 'MY_USER'
file_env 'MY_PASSWORD'
if [ "$MY_USER" -a "$MY_PASSWORD" ]; then
    echo "CREATE USER '$MY_USER'@'%' IDENTIFIED BY '$MY_PASSWORD' ;" | "${mysql[@]}"
    echo "GRANT ALL ON \`$MY_DB_NAME\`.* TO '$MY_USER'@'%' ;" | "${mysql[@]}"
    echo 'FLUSH PRIVILEGES ;' | "${mysql[@]}"
fi

mysql -u $MY_USER -p$MY_PASSWORD $MY_DB_NAME < /data/data.sql
