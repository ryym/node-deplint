import HookableCodeTraverser from './HookableCodeTraverser';
import ImportedModule from './ImportedModule';
import { createHooks } from './moduleCollectorHooks';

/**
 * ImportedModuleCollector traverses source code and
 * collects imported module inofmration.
 */
export default class ImportedModuleCollector {

  /**
   * Initialize ImportedModuleCollector
   * @param {Object} parserOptions - The options for `HookableCodeTraverser`.
   * @see {@link HookableCodeTraverser}
   */
  constructor(parserOptions) {
    const store = this._modules = {};
    const hooks = createHooks(store);
    this._traverser = this._createTraverser(hooks, parserOptions);
  }

  /**
   * Convert the given source code to the AST and traverse it
   * to collect information about imported modules.
   * @param {string} text
   * @param {FileInfo} fileInfo
   * @return {void}
   */
  searchImports(text, fileInfo) {
    try {
      this._traverser.traverse(text, fileInfo);
    }
    catch (ex) {
      const filePath = fileInfo.getPath();
      throw new Error(`Failed to parse ${filePath} (${ex.message})`);
    }
  }

  /**
   * Returns an array of imported module information
   * this instance currently stores.
   * @return {ImportedModule[]}
   */
  collectImportedModules() {
    return Object.keys(this._modules).map(name => {
      const dependents = this._modules[name];
      return new ImportedModule(name, dependents);
    });
  }

  /**
   * Clear all module information this instance currently stores.
   * @return {void}
   */
  clearFoundModules() {
    Object.keys(this._modules).forEach(name => {
      delete this._modules[name];
    });
  }

  /**
   * Create an instance of {@link HookableCodeTraverser}.
   * @private
   */
  _createTraverser(hooks, parserOptions) {
    const traverser = new HookableCodeTraverser(parserOptions);

    Object.keys(hooks).forEach(nodeType => {
      const hook = hooks[nodeType];
      traverser.addHook(nodeType, hook);
    });
    return traverser;
  }
}
