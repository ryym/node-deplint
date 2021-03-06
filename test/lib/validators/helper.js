import assert from 'power-assert';
import FileInfo from '$lib/FileInfo';
import PackageJson from '$lib/PackageJson';
import ImportedModule from '$lib/codeAnalyzer/ImportedModule';

/**
 * Create an instance of {@link PackageJson} that
 * has specified dependencies and devDependencies.
 * @param {string[]} deps - The dependency names.
 * @param {string[]} devDeps - The dev dependency names.
 * @param {string[]} peerDeps - The peer dependency names.
 * @return {PackageJson}
 */
export function makePackageJson({ deps, devDeps, peerDeps = [] }) {
  return new PackageJson('path', {
    dependencies: arrayToObj(deps, ''),
    devDependencies: arrayToObj(devDeps, ''),
    peerDependencies: arrayToObj(peerDeps, '')
  });
}

/**
 * Create a tester function for validators (Curried).
 * The tester creates test cases for each parameter.
 * @param {PackageJson} packageJson
 * @param {Function} makeValidator
 * @param {Object} options - The options for validator.
 * @param {Object[]} params
 * @return {Function} A tester function.
 */
export const makeValidatorTester = (
  packageJson, makeValidator
) => (
  options, params
) => {
  const validate = makeValidator(packageJson, makeReporter, options);

  params.forEach(p => {
    it(`${p.title}`, () => {
      const report = validate(p.modules);
      assert.deepEqual(report._report, p.report);
    });
  });
};

/**
 * Create an instance of {@link ImportedModule}.
 * @param {string} name - The module name.
 * @param {string[]} fileTypes - 'lib' or 'dev'.
 * @return {ImportedModule}
 */
export function module(name, ...fileTypes) {
  const dependents = fileTypes.map(type => {
    const isLib = type === 'lib';
    return FileInfo[isLib ? 'asLib' : 'asDev']('_');
  });
  return new ImportedModule(name, dependents);
}

/**
 * Convert an array to an object.
 * @private
 * @param {Array} array
 * @param {*} value - The value of all keys.
 */
function arrayToObj(array, value) {
  return array.reduce((o, arrayValue) => {
    o[arrayValue] = value;
    return o;
  }, {});
}

/**
 * Create reporter used by validators
 * to report errors.
 * @private
 * @return {Object}
 */
function makeReporter() {
  const report = { dep: [], devDep: [] };
  return {
    addDep(moduleName) {
      report.dep.push(moduleName);
    },

    addDevDep(moduleName) {
      report.devDep.push(moduleName);
    },

    _report: report
  };
}
