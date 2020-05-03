#!/bin/bash

file_env 'DB_NAME'
if [ "$DB_NAME" ]; then
    echo "Create Database '$DB_NAME' if not exists"
    echo "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8 COLLATE utf8_general_ci;" | "${mysql[@]}"
fi

file_env 'TEST_DB_NAME'
if [ "$TEST_DB_NAME" ]; then
    echo "Create Database '$TEST_DB_NAME' if not exists"
    echo "CREATE DATABASE IF NOT EXISTS \`$TEST_DB_NAME\` CHARACTER SET utf8 COLLATE utf8_general_ci;" | "${mysql[@]}"
fi

file_env 'DB_USER'
file_env 'DB_PASSWORD'
if [ "$DB_USER" -a "$DB_PASSWORD" ]; then
    echo "Create User '$DB_USER' if not exists"
    echo "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD' ;" | "${mysql[@]}"
    echo "Grant permissions for '$DB_USER' to '$DB_NAME'"
    echo "GRANT ALL ON \`$DB_NAME\`.* TO '$DB_USER'@'%' ;" | "${mysql[@]}"
    if [ "$TEST_DB_NAME" ]; then
      echo "Grant permissions for '$DB_USER' to '$TEST_DB_NAME'"
      echo "GRANT ALL ON \`$TEST_DB_NAME\`.* TO '$DB_USER'@'%' ;" | "${mysql[@]}"
    fi
    echo 'FLUSH PRIVILEGES ;' | "${mysql[@]}"
fi
