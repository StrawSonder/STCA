module.exports = {
    name: "role",
    description: "Adds roles that are allowed to be added",
    run: async (client, message, args) => {
        const roleArr = ["NA", "EU", "JP", "SW", "LFG", "Frontline", "Midline", "Backline", "Support"];
        if (args.length != 1) {
            message.channel.send("Invalid use. Please type the role you would like to add or remove!")
            return;
        } 
        var role = message.guild.roles.find(ele => ele.name.toLowerCase() === args[0].toLowerCase())
        if (role != undefined) {
            if (roleArr.findIndex(ele => ele.toLowerCase() === args[0].toLowerCase()) == -1) {
                message.channel.send("I'm sorry! You cannot use that role!");
            }
            if (message.member.roles.find(ele => ele.name === role.name)) {
                message.member.removeRole(role);
                message.channel.send(`Successfully removed the role ${role.name}!`)
            } else {
                message.member.addRole(role);
                message.channel.send(`Successfully added the role ${role.name}!`)
            }
        } else message.channel.send("That is not a role!");
    }
}