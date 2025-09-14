const nodeunit = require('nodeunit');
const fs = require('fs');
const path = require('path');

const testFiles = fs.readdirSync('test')
  .filter(file => file.endsWith('.js') && file !== 'server/index.js')
  .map(file => path.join('test', file));

nodeunit.reporters.default.run(testFiles, null, (err) => {
  if (err) {
    console.error('Tests failed:', err);
    process.exit(1);
  } else {
    console.log('All tests passed successfully');
    process.exit(0);
  }
});