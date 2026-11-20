import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { resolveTravel } from './travel.ts';

export function travelPlugin(): Plugin {
  const id = 'virtual:travel';
  const resolvedId = `\0${id}`;
  let root = '';
  let queue = Promise.resolve();
  return {
    name: 'travel-coordinates',
    configResolved(config) { root = config.root; },
    resolveId(source) { if (source === id) return resolvedId; },
    async load(source) {
      if (source !== resolvedId) return;
      this.addWatchFile(resolve(root, 'content/travel.json'));
      // Client/SSR loads share the disk cache without racing to update it.
      const task = queue.then(() => resolveTravel(root));
      queue = task.then(() => {}, () => {});
      const records = await task;
      return `export default ${JSON.stringify(records)};`;
    },
    handleHotUpdate(context) {
      if (context.file !== resolve(root, 'content/travel.json')) return;
      const module = context.server.moduleGraph.getModuleById(resolvedId);
      if (module) return [module];
    },
  };
}
