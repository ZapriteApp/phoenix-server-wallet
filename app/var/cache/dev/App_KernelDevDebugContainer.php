<?php

// This file has been auto-generated by the Symfony Dependency Injection Component for internal use.

if (\class_exists(\ContainerDU0KFx1\App_KernelDevDebugContainer::class, false)) {
    // no-op
} elseif (!include __DIR__.'/ContainerDU0KFx1/App_KernelDevDebugContainer.php') {
    touch(__DIR__.'/ContainerDU0KFx1.legacy');

    return;
}

if (!\class_exists(App_KernelDevDebugContainer::class, false)) {
    \class_alias(\ContainerDU0KFx1\App_KernelDevDebugContainer::class, App_KernelDevDebugContainer::class, false);
}

return new \ContainerDU0KFx1\App_KernelDevDebugContainer([
    'container.build_hash' => 'DU0KFx1',
    'container.build_id' => '7140dc1c',
    'container.build_time' => 1722070621,
    'container.runtime_mode' => \in_array(\PHP_SAPI, ['cli', 'phpdbg', 'embed'], true) ? 'web=0' : 'web=1',
], __DIR__.\DIRECTORY_SEPARATOR.'ContainerDU0KFx1');
