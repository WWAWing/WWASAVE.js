<?php

    require_once './vendor/autoload.php';

    use Illuminate\Database\Capsule\Manager as Capsule;

    $capsule = new Capsule;

    $capsule->addConnection([
        'driver'    => 'mysql',
        'host'      => 'mysql',
        'port'      => '3306',
        'database'  => 'wwasave',
        'username'  => 'root',
        'password'  => 'qazwsx',
        'charset'   => 'utf8',
        'collation' => 'utf8_unicode_ci'
    ]);

    // Set the event dispatcher used by Eloquent models... (optional)
    use Illuminate\Events\Dispatcher;
    use Illuminate\Container\Container;

    $capsule->setEventDispatcher(new Dispatcher(new Container));

    // Make this Capsule instance available globally via static methods... (optional)
    $capsule->setAsGlobal();

    // Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
    $capsule->bootEloquent();
