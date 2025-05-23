const Fetch = require('./lib/commands/fetch');

// Existing index.js code, with the addition of the fetch command to the exports
Object.keys(Command.prototype).forEach(function (name) {
    if (Osmosis[name] !== undefined) {
        return;
    }

    Osmosis[name] = function StartingFunction(arg1, arg2, arg3) {
        var instance = new Osmosis(),
            command  = instance.command;

        instance.calledWithNew = (this instanceof StartingFunction);

        return command[name](arg1, arg2, arg3);
    };
});

// Add fetch method to Osmosis
Osmosis.fetch = Fetch;

module.exports = Osmosis;