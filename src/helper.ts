import warning from 'warning';

export function merge(...hooks: (() => Record<string, any>)[]) {
  return () => {
    return hooks.reduce((props: Record<string, any>, hook) => {
      if (typeof hook === 'function') {
        const current = hook();
        Object.keys(current).forEach(key => {
          warning(!props[key], `${key} conflict in merged result`);
          props[key] = current[key];
        });
      } else {
        warning(true, 'merge param should be a hook function');
      }

      return props;
    }, {});
  };
}
