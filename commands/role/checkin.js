const cannotUse = "I'm sorry, you cannot use that command.";

module.exports = {
    name: "checkin",
    description: "Allows teachers to checkin",
    run: async (client, message, args) => {
        var offline = message.guild.roles.find(role => role.name === "Offline Teacher");
        var teacher = message.guild.roles.find(role => role.name === "Teacher");
        if (message.member.roles.find(role => role.name === "Offline Teacher")) {
            message.channel.send("You have successfully checked in.")
            message.member.addRole(teacher);
            message.member.removeRole(offline);
        } else if (message.member.roles.find(role => role.name === "Teacher")) {
            message.channel.send("You are already checked in!");
        } else {
            message.channel.send(cannotUse);
        }
    }
}