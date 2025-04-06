// Mocha globals shim for VSCode extension tests
global.suite = function(name, fn) {
  describe(name, fn);
};

global.test = function(name, fn) {
  it(name, fn);
};

global.suiteSetup = function(fn) {
  beforeAll(fn);
};

global.suiteTeardown = function(fn) {
  afterAll(fn);
};

global.setup = function(fn) {
  beforeEach(fn);
};

global.teardown = function(fn) {
  afterEach(fn);
};