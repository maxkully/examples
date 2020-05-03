GrowFlow Code Exercise
======================

### Description

##### PHP
[Description](description.pdf)

##### SQL

Дано:
1. таблица clients, поля id, name
2. таблица orders, поля id, client_id, price

[sample_data](docker/mysql/data.sql)

Надо:

1. Выбрать для каждого клиента количество заказов ценой меньше 1000 и больше 1000. (client_id, count1, count2)
2. Выбрать третий заказ для каждого клиента ( id, client_id, price)
3. Выбрать для каждого клиента третий заказ сделанный после заказа стоимостью больше 1000 ( id, client_id, price)

Solution:

[sql_exercise.sql](sql_exercise.sql)

### Environment variables

* `LOG_LEVEL`
* `LOG`

More in [.env](.env.example)

### Features

* Supported `JSON` & `CSV` data formats for I/O
* Supported `Std` I/O

### DevTools

* [Docker](https://docs.docker.com/)
* [PHP MessDetector](https://phpmd.org/)
* [PHP CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer/wiki)
* [PHPUnit](https://phpunit.readthedocs.io/en/9.1/)
* [PHPBench](https://phpbench.readthedocs.io/en/latest/introduction.html)

### Usage

```bash

# Install environment
docker-compose up

# Execute denormalize for example from exercise
docker-compose run --rm php index.php < tests/fixtures/input_example.json

# Run auto tests
docker-compose run --rm vendor/bin/phpunit

# Run mess detector
docker-compose run --rm vendor/bin/phpmd src/ text phpmd.xml

# Run code style checking
docker-compose run --rm vendor/bin/phpcs

# Run benchmarking 
vendor/bin/phpbench run tests/benchmarking/CalendarBench.php --report default 
```

### Roadmap

* Autoload initializers
* Support `Redis` I/O
* Support Local Files I/O
* Support `DB` I/O
* Advanced validation & security
* Advanced exception quality
* Advanced benchmarking
* ELK support
