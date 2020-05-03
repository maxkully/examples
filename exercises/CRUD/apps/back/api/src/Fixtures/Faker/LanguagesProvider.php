<?php

namespace BDT\Fixtures\Faker;

class LanguagesProvider
{
    public static function supportedLanguages()
    {
        $items = ['en', 'ru', 'ky', 'uz'];
        return  $items[array_rand($items)];
    }
}
