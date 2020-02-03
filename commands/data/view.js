module.exports = {
    name: "view",
    description: "Lets user view the data currently stored with their id",
    run: async (client, message, args) => {
        if (args.length != 2) {
            message.channel.send("Incorrect usage! Correct usage is:\n"
                + "!!update [mode] [rank]\nex. !!update TC S");
            return;
        }
        //finds the rank object associated with the user
        var ind = ranks.findIndex(rank => rank.id == message.member.id);
        if (ind == -1) {
            message.channel.send("You must register first!");
            return;
        }
        //sets the specific rank
        try {
            ranks[ind].set(args[0].toUpperCase(), args[1].toUpperCase());
        } catch (err) {
            message.channel.send(err);
            return;
        }
        var old = ranks[ind].role;
        // ranks[ind] = setYear(ranks[ind]);
        ranks[ind].setYear();
        var add = "";
        //checks if user should have changed a class
        if (old != ranks[ind].role) {
            add = "\nYou are now a " + ranks[ind].role.name + "!";
            registration(message.member, roles, ranks[ind].role);
        }
        message.channel.send(greeting + "Your " + args[0].toUpperCase() + " rank is now " + args[1].toUpperCase() + "." + add);
    }
}