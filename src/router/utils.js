export function asyncComponent(componentName) {
  const splitName = componentName.split('/');

  switch (splitName.length) {
    case 2: {
      return () => import(`@/views/${splitName[0]}/${splitName[splitName.length - 1]}.vue`);
    }
    case 3: {
      return () => import(`@/views/${splitName[0]}/${splitName[1]}/${splitName[splitName.length - 1]}.vue`);
    }
    default: {
      return () => import(`@/views/${splitName[splitName.length - 1]}.vue`);
    }
  }
}

export function scrollBehavior(to, from, savedPosition) {
  if (to.meta.keepScroll && from.meta.keepScroll) {
    return null;
  }

  if (savedPosition) {
    return savedPosition;
  }
  if (to.hash) {
    const position = {};
    position.selector = to.hash;
    return position;
  }
  return { x: 0, y: 0 };
}
