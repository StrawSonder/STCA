const { readdirSync } = require("fs");

const ascii = require("ascii-table"); 

const table = new ascii().setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, '❌');
                continue;
            }

            if (pull.aliases && Array.isArray(pull)) {
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }
        }
    });
    // uncomment if you want to see the table that shows the commands and their load statuses
    console.log(table.toString());
}