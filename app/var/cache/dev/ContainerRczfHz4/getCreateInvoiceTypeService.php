<?php

namespace ContainerRczfHz4;

use Symfony\Component\DependencyInjection\Argument\RewindableGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\Exception\RuntimeException;

/**
 * @internal This class has been auto-generated by the Symfony Dependency Injection Component.
 */
class getCreateInvoiceTypeService extends App_KernelDevDebugContainer
{
    /**
     * Gets the private 'App\Form\CreateInvoiceType' shared autowired service.
     *
     * @return \App\Form\CreateInvoiceType
     */
    public static function do($container, $lazyLoad = true)
    {
        include_once \dirname(__DIR__, 4).'/vendor/symfony/form/FormTypeInterface.php';
        include_once \dirname(__DIR__, 4).'/vendor/symfony/form/AbstractType.php';
        include_once \dirname(__DIR__, 4).'/src/Form/CreateInvoiceType.php';

        return $container->privates['App\\Form\\CreateInvoiceType'] = new \App\Form\CreateInvoiceType();
    }
}
