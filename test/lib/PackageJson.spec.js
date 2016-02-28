import assert from 'power-assert';
import path from 'path';
import PackageJson from '$lib/PackageJson';

const FIXTURE_PATH = path.resolve(__dirname, './fixtures');

/** @test {PackageJson} */
describe('PackageJson', () => {
  const packageJson = new PackageJson(FIXTURE_PATH);

  it('loads nearest package.json', () => {
    assert.equal(
      packageJson.get('name'),
      'depcop-unit-test-fixture'
    );
  });

  /** @test {PackageJson#hasDep} */
  describe('#hasDep()', () => {
    it('checks if the module is in `dependencies`', () => {
      assert.deepEqual(
        [packageJson.hasDep('foo'), packageJson.hasDep('unknown')],
        [true, false]
      );
    });
  });

  /** @test {PackageJson#hasDevDep} */
  describe('#hasDevDep()', () => {
    it('checks if the module is in `devDependencies`', () => {
      assert.deepEqual(
        [packageJson.hasDevDep('dev-foo'), packageJson.hasDevDep('unknown')],
        [true, false]
      );
    });
  });
});