<?php

namespace ContainerRczfHz4;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/**
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getHistoryControllerService extends App_KernelDevDebugContainer
{
    /**
     * Gets the public 'App\Controller\HistoryController' shared autowired service.
     *
     * @return \App\Controller\HistoryController
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 4).'/vendor/symfony/framework-bundle/Controller/AbstractController.php';
        include_once \dirname(__DIR__, 4).'/src/Controller/HistoryController.php';

        $container->services['App\\Controller\\HistoryController'] = $instance = new \App\Controller\HistoryController();

        $instance->setContainer(($container->privates['.service_locator.O2p6Lk7'] ?? $container->load('get_ServiceLocator_O2p6Lk7Service'))->withContext('App\\Controller\\HistoryController', $container));

        return $instance;
    }
}
