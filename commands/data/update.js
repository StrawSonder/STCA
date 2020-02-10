const Ranks = require("../../models/ranks.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://lzhang11:Ny5d6fTYra3CUT82@cluster0-shard-00-00-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-02-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-01-07nkg.mongodb.net:27017/Ranks?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin"
    , {useNewUrlParser: true});

module.exports = {
    name: "update",
    description: "Updates rank for a specific mode",
    run: async (client, message, args) => {
        if (args.length != 2) {
            message.channel.send("Incorrect usage! Correct usage is:\n"
                + "!!update [mode] [rank]\nex. !!update TC S");
            return;
        }
        //finds the rank object associated with the user
        Ranks.findOne({userID: message.member.user.id},
            (err, ranks) => {
                if (!ranks) {
                    message.channel.send("You must register first!");
                } else {
                    if (ranks[args[0].toUpperCase()] == undefined) {
                        message.channel.send("Invalid mode! Mode must be TC, SZ, RM, or CB.");
                    } else {
                        try {
                            checkRank(args[1].toUpperCase());
                            if (ranks[args[0].toUpperCase()] == args[1].toUpperCase()) {
                                message.channel.send("You are already " + args[1].toUpperCase() + " in " + args[0].toUpperCase() + "!");
                                return;
                            }
                            ranks[args[0].toUpperCase()] = args[1].toUpperCase();
                            var arr = [ranks.TC, ranks.SZ, ranks.RM, ranks.CB];
                            for (var i = 0; i < 4; i++) arr[i] = arr[i].toUpperCase();
                            var total = 0;
                            for (var i = 0; i < 4; i++) total += checkRank(arr[i]);
                            var name;
                            if (total < 10 ) name = "Freshman";
                            else if (total < 20) name = "Sophomore";
                            else if (total < 30) name = "Junior";
                            else name = "Senior";
                            var add = "";
                            if (ranks.role != name) {
                                var freshman = message.guild.roles.find(role => role.name === "Freshman");
                                var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
                                var junior = message.guild.roles.find(role => role.name === "Junior");
                                var senior = message.guild.roles.find(role => role.name === "Senior");
                                var visitor = message.guild.roles.find(role => role.name === "Visitor");
                                var roles = [freshman, sophomore, junior, senior, visitor];
                                if (!message.member.roles.find(ele => ele.name == "Teacher" || ele.name == "Offline Teacher")) {
                                    registration(message.member, roles, name);
                                    ranks.role = name;
                                    add = "\nYou are now a " + name + "!";
                                }
                            }
                            message.channel.send("Your " + args[0].toUpperCase() + " rank is now " + args[1].toUpperCase() + "." + add);
                            ranks.save().catch(err => console.log(err));
                        } catch (err) {
                            message.channel.send(err);
                        }
                    }
                }
            });
    }
}