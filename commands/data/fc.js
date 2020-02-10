const Ranks = require("../../models/ranks.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://lzhang11:Ny5d6fTYra3CUT82@cluster0-shard-00-00-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-02-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-01-07nkg.mongodb.net:27017/Ranks?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin"
    , {useNewUrlParser: true});

/**
 * Checks the fc to see if it is valid (in the right format)
 * @param fc the friend code to be checked
 * @return the message that should be sent, depending on if the fc is valid or not
 */
checkFC = (fc) => {
    fc = fc.replace(/[^0-9\/]+/g, "");
    if (fc.length == 12) {
        return "Your FC is: " + fc.substring(0, 4) + "-" + fc.substring(4, 8) + "-" + fc.substring(8);
    } else {
        return "Your FC is not valid! It should have 12 digits, like ####-####-####, or similar";
    }
}

/**
 * Checks the ranks to see if the member has registered or put in an fc yet
 * @param message original sent message
 * @param ranks variable containing information about the member
 * @param member the member to be checked
 */
checkRegister = (message, ranks, member) => {
    if (!ranks) {
        message.channel.send(member.user.username + " has not registered yet!");
        return;
    }
    if (ranks.fc == "") {
        message.channel.send(member.user.username + " has not added their fc yet!");
    } else {
        message.channel.send(checkFC(ranks.fc));
    }
}

module.exports = {
    name: "fc",
    description: "Updates friend code for a user",
    run: async (client, message, args) => {
        var str;
        if (args.length == 0) {
            Ranks.findOne({userID: message.member.user.id},
                (err, ranks) => {
                    checkRegister(message, ranks, message.member);
                });
        } else if (args.length == 1) {
            var member = message.mentions.members.first();
            if (member == undefined) {
                var member = message.guild.members.find(member => member.user.username === args[0]);
                if (member) {
                    Ranks.findOne({userID: member.user.id},
                        (err, ranks) => {
                            checkRegister(message, ranks, member);
                        });
                } else {
                    str = checkFC(args[0]);
                    if (str.includes("not")) {
                        message.channel.send(args[0] + " is an invalid user or an invalid fc.");
                    } else {
                        Ranks.findOne({userID: message.member.user.id},
                            (err, ranks) => {
                                if (!ranks) {
                                    message.channel.send("You must register first!");
                                } else {
                                    ranks.fc = str.substring(12); //cuts out "Your fc is: "
                                    message.channel.send(str);
                                    ranks.save().catch(err => console.log(err));
                                }
                            });
                    }
                }
            } else {
                Ranks.findOne({userID: member.user.id},
                    (err, ranks) => {
                        checkRegister(message, ranks, member);
                    });
            }
        } else if (args.length == 3) {
            var str = checkFC(args[0] + args[1] + args[2]);
            if (str.includes("not")) {
                message.channel.send(str);
            } else {
                Ranks.findOne({userID: message.member.user.id},
                    (err, ranks) => {
                        if (!ranks) {
                            message.channel.send(member.user.username + " has not registered yet!");
                            return;
                        } else {
                            ranks.fc = str.substring(12);
                            message.channel.send(str);
                            ranks.save().catch(err => console.log(err));
                        }
                    });
            }
        } else {
            message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
        }
    }
}