# Vocabulary Exercise

### Roadmap

* ~~Prepare Docker environment~~
* ~~Implement CLI wrapper~~
* ~~Implement simple parsing file~~
* ~~Implement simple storage words and appearance hash~~
* ~~Implement dispatching storage by word~~
* ~~Implement reading files by chunk~~
* ~~Implement fixtures generation~~
* ~~Refactoring~~
* ~~Documentation~~
* ~~Add logging and code sniffing~~
* ~~Actualize documentation~~

### General solutions

* ~~Implement CLI for parsing & generate fixtures~~
* ~~Reading large files by chunk~~
* ~~Separate vocabulary by some hash~~

### Setting up

    # Build docker containers
    docker-compose build --no-cache --force-rm
    # Provide your personal github token for installing some packages from github
    docker-compose run --rm app composer config --global --auth github-oauth.github.com <github_personal_token>
    # Install all dependencies
    docker-compose run --rm app composer install
    # Entering to container for using CLI
    docker-compose run --rm app bash
    # Generate fixtures
    php cli.php fixture <N>
    # Call parsing file
    php cli.php load tmp/storage/fixture.txt --reset
    # See occurrencies
    php cli.php count lorem
    
    # Check style guide by PSR12
    ./vendor/bin/phpcs --standard=PSR12 src/
    
    # Run tests
    ./vendor/bin/phpunit
    
### Known Issues

* Single threading
* Needing more tests
* Very simple dispatching function

### Improvements

* Redis support
* Database support
* Support more data formats (CSV, JSON, YAML etc)
