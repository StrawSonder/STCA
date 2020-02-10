module.exports = {
    name: "help",
    description: "Messages to explain commands",
    run: async (client, message, args) => {
        if (args[0] == undefined) {
        message.channel.send('Available commands:\n'
            + '!!register       register if you are a student\n'
            + '!!fc             update your friend code, check your friend code, or check others\' friend codes\n'
            + '!!role           add or remove a role; use !!help role to see the list\n'
            + '!!update         update the rank of a specific mode\n'
            + '!!view           view your ranks and fc\n'
            + 'If you do not know how to use these commands, use !!help [command]');
        } else if (args[0].toLowerCase() == "register") {
            message.channel.send("To register as a student, use !!register [TC] [SZ] [RM] [CB]\n"
            + "ex. !!register C+ B- A S+7");
        } else if (args[0].toLowerCase() == "update") {
            message.channel.send("To update the rank of a specific role, use !!update [mode] [rank]\n"
            + "ex. !!update TC S");
        } else if (args[0].toLowerCase() == "role") {
            message.channel.send("To add or remove a role, use !!role\n\nHere are the roles you can choose from:\n"
                + "LFG (If you are interested in being pinged for people looking for game)\n"
                + "NA (If you are in the NA timezone)\n"
                + "EU (If you are in the EU timezone)\n"
                + "JP (If you are in the JP timezone)\n"
                + "SW (Stands for 'Stream Watcher,' for if you would like to watch peoples' streams!)\n"
                + "Frontline\n" + "Midline\n" + "Backline\n"+ "Support");
        } else if (args[0].toLowerCase() == "fc") {
            message.channel.send("To add your own fc, use !!fc [your fc]\nTo get your fc, use !!fc\nTo get someone else's fc, use !!fc @[user]"
                + " or !!fc user");
        } else if (args[0].toLowerCase() == '<@!368889460378697730>' || args[0].toUpperCase() == '<@368889460378697730>') {
            message.channel.send("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA IM COMING TO HELP YOU HANG ON"
                + "unless im sleeping or in school or streaming or busy in other way but otherwise AAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        } else if (args[0].toLowerCase() == "view") {
            message.channel.send("Use !!view to see your current data!");
        } else message.channel.send("I cannot help with that, I'm sorry!");
    }
}