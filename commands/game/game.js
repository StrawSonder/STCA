module.exports = {
    name: "game",
    description: "Start a game with some students/teachers",
    run: async (client, message, args) => {
        message.delete();
        if (args.length != 1) {
            message.channel.send("Invalid usage! Correct usage is:\n!!game [numPeople] ex. !!game 8\n"
                + "Right now, only 8 people will work.");
            return;
        }
        if (args[0] != 8) {
            message.channel.send("Command currently does not support anything other than 4v4.");
            return;
        }
        message.channel.send("Game was started! React with :thinking: to play, :ninjasquid: to spectate.");
        const filter = reaction => {
            return reaction.emoji.name === '👌' || reaction.emoji.name === '🤔';
        };
        message.channel.fetchMessages({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            lastMessage.awaitReactions(filter, {maxUsers: 1, time: 60000, errors: ['time']})
                .then(collected => console.log(collected)).catch(collected => {
                    message.channel.send(`After a minute, only ${collected.size} out of 8 reacted.`);
                });
        }).catch(console.error);
    }
}