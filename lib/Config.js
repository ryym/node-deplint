import glob from 'glob';
import FileInfo from './FileInfo';

/**
 * Config stores and provides configurations.
 */
export default class Config {
  constructor(config) {
    this._config = config;
  }

  getEnabledInspectors() {
    return this._config.checks;
  }

  // TODO: Enable to ignore some files.
  // TODO: Enable to define aliases for some modules.
  listAllTargetFiles() {
    const { libSources, devSources } = this._config;
    const libSourcePaths = this._glob(libSources);
    const devSourcePaths = this._glob(devSources);

    return [].concat(
      libSourcePaths.map(p => FileInfo.asLib(p)),
      devSourcePaths.map(p => FileInfo.asDev(p))
    );
  }

  _glob(paths) {
    return glob.sync(paths, { realpath: true });
  }
}