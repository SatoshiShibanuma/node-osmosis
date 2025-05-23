'use strict';

const Command = require('./lib/Command.js');
const Queue   = require('./lib/Queue.js');
const request = require('./lib/Request.js');
const libxml  = require('libxmljs-dom');
const fetchCommand = require('./lib/commands/fetch.js');  // Add fetch command import

// Rest of the existing index.js remains the same
// ... (previous content)

// Add fetch command to available commands
Object.keys(fetchCommand).forEach(function (name) {
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

module.exports = Osmosis;