const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const mocha = new Mocha();

// Add the test files
const testDir = path.join(__dirname, 'test');
fs.readdirSync(testDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    mocha.addFile(path.join(testDir, file));
  });

// Run the tests
mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;
});