// Hook de resolução para rodar src/lib/__checks__.ts com Node >= 23 (type stripping nativo).
// Uso: node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); }
    catch (e) {
      if (specifier.startsWith('.')) {
        for (const ext of ['.ts', '/index.ts']) {
          try { return nextResolve(specifier + ext, context); } catch {}
        }
      }
      throw e;
    }
  },
});
