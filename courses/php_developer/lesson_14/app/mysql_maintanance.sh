# Information schema
mysql -u root -ppassword
use information_schema
show tables;

mysqlshow -u admin -ppassword
mysqlshow -u admin -ppassword library

# DATABASE DUMP
mysqldump -u admin -ppassword library > dump.sql
# SOME Tables dump
mysqldump -u admin -ppassword library author composition > compositions.sql

mysqldump -u admin -ppassword library | gzip > dump.sql.gz

DROP DATABASE library;
CREATE DATABASE library;

mysql -u admin -ppassword library < dump.sql
gunzip < dump.sql.gz | mysql -u admin -ppassword library

# see my.cnf
# [client]
# user=admin
# password=password
# database=library
