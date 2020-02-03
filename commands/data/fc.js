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

module.exports = {
    name: "fc",
    description: "Updates friend code for a user",
    run: async (client, message, args) => {
        var str;
        var ind = ranks.findIndex(rank => rank.id == message.member.id);
        if (ind == -1) {
            message.channel.send("You must register first!");
            return;
        }
        if (args.length == 0) {
            if (ranks[ind].fc == undefined) {
                message.channel.send("You haven't set your fc yet! Set your fc with !!fc [your fc]");
                return;
            } else {
                message.channel.send("Your fc: " + ranks[ind].fc);
            }
        } else if (args.length == 1) {
            var member = message.mentions.members.first();
            if (member == undefined) {
                if (ranks[ind].fc == undefined) {
                    var str = checkFC(args[0]);
                    if (!str.includes("not valid")) {
                        ranks[ind].fc = str.split(/:+/)[1].substring(1);
                    }
                    message.channel.send(str);
                } else {
                    message.channel.send("Are you sure you want to overwrite your existing fc? Please run the command with a self-mention if you are sure.");
                    ranks[ind].ask = true;
                }
                return;
            }
            if (member == message.member) {
                if (ranks[ind].fc != undefined) {
                    if (ranks[ind].ask) {
                        message.channel.send("You need to specify your new fc!");
                    } else {
                        message.channel.send("Are you sure you want to overwrite your existing fc? Enter the command again with your new fc to proceed.");
                        ranks[ind].ask = !ranks[ind].ask;
                    }
                } else {
                    message.channel.send("You need to specify an fc.");
                }
            } else {
                ind = ranks.findIndex(rank => rank.id == member.id);
                if (ind == -1) {
                    message.channel.send("That member hasn't registered yet!");
                } else {
                    if (ranks[ind].fc == undefined) {
                        message.channel.send("That member hasn't put in their fc yet!");
                    } else {
                        message.channel.send("fc: " + ranks[ind].fc);
                    }
                }
            }
            
        } else if (args.length == 2) {
            var member = message.mentions.members.first();
            if (member == undefined) {
                message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
                return;
            }
            if (member == message.member) {
                if (ranks[ind].fc != undefined) {
                    if (ranks[ind].ask) {
                        str = checkFC(args[1]);
                        if (!str.includes("not valid")) {
                            ranks[ind].fc = str.split(/:+/)[1].substring(1);
                        }
                        message.channel.send(str);
                    } else {
                        message.channel.send("Are you sure you want to overwrite your existing fc? Enter the command again to proceed.");
                    }
                    ranks[ind].ask = !ranks[ind].ask;
                } else {
                    str = checkFC(args[1]);
                    if (!str.includes("not valid")) {
                        ranks[ind].fc = str.split(/:+/)[1].substring(1);
                    }
                    message.channel.send(str);
                }
            } else {
                message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
            }
        } else {
            message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
        }
    }
}