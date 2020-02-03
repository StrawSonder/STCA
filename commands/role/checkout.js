const cannotUse = "I'm sorry, you cannot use that command.";

module.exports = {
    name: "checkout",
    description: "Allows teachers to checkin",
    run: async (client, message, args) => {
        var offline = message.guild.roles.find(role => role.name === "Offline Teacher");
        var teacher = message.guild.roles.find(role => role.name === "Teacher");
        if (message.member.roles.find(role => role.name === "Teacher")) {
            message.channel.send("You have successfully checked out.")
            message.member.addRole(offline);
            message.member.removeRole(teacher);
        } else if (message.member.roles.find(role => role.name === "Offline Teacher")) {
            message.channel.send("You are already checked out!");
        } else {
            message.channel.send(cannotUse);
        }
    }
}