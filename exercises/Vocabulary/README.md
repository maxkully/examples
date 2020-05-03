# Vocabulary Exercise

### Roadmap

* Prepare Docker environment
* Implement CLI wrapper
* Implement simple parsing file
* Implement simple storage words and appearance hash
* Implement dispatching storage by word
* Implement reading files by chunk
* Implement fixtures generation
* Refactoring
* Documentation
* Add logging and code sniffing
* Actualize documentation

### General solutions

* Implement CLI for parsing & generate fixtures
* Reading large files by chunk
* Separate vocabulary by words size and first letter

### Setting up

    docker-compose run --rm app bash
    php cli.php fixture <N>
    php cli.php load tmp/storage/fixture.txt
    
    # Check style guide by PSR2
    ./vendor/bin/phpcs --standard=PSR2 src/
    
### Known Issues

* Single threading
* Lack of unit tests
* Very simple dispatching function

### Improvements

* Redis support
* Database support
* Support more data formats (CSV, JSON, YAML etc)
