const Osmosis = require('./index.js');
const fetchCommand = require('./lib/commands/fetch');

// Append fetch command to Osmosis
Osmosis.fetch = function(url, options) {
  const instance = new Osmosis();
  return instance.command.use(fetchCommand(url, options));
};

module.exports = Osmosis;