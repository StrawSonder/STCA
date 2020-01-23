//https://regex101.com/r/OrmORY/1

var roles;

initial = (message) => {
    roles = message.guild.roles;
}

/**
 * Checks if the rank is valid
 * @param rank the rank to be checked
 * @throws error containing message for invalid rank
 * @return str if there is an error, the associated total if no error
 */
checkRank = (rank) => {
    var total = 0;
    if (rank === "C-") total += 0.5;
    else if (rank === "C") total += 1;
    else if (rank === "C+") total += 1.5;

    else if (rank === "B-") total += 2;
    else if (rank === "B") total += 2.5;
    else if (rank === "B+") total += 3;

    else if (rank === "A-") total += 3.5;
    else if (rank === "A") total += 4;
    else if (rank === "A+") total += 4.5;

    else if (rank === "S") total += 5;

    else if (rank === "S+0") total += 5.5;
    else if (rank === "S+1") total += 5.5;
    else if (rank === "S+2") total += 5.5;
    else if (rank === "S+3") total += 6;
    else if (rank === "S+4") total += 6;
    else if (rank === "S+5") total += 6;
    else if (rank === "S+6") total += 6.5;
    else if (rank === "S+7") total += 6.5;
    else if (rank === "S+8") total += 6.5;
    else if (rank === "S+9") total += 7;

    else if (rank === "X") total += 8;
    
    else if (rank === "S+") throw "Please add a number after S+.";
    else throw "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\nex. !!register C B A S";
    return total;
}

/**
 * Calculates the total associated with those ranks
 * @param rank the rank associated with the mode
 * @throws error containing message for invalid rank
 * @return str if there is an error, the associated total if no error
 */
calcTotal = (TC, SZ, RM, CB) => {
    var arr = [TC, SZ, RM, CB];
    var total = 0;
    for (var i = 0; i < 4; i++) total += checkRank(arr[i]);
    return total;
}


/**
 * Gets the role associated with the total
 * @param total the total to be used for calculation
 * @return rolename of the role that should be given to the user that has that total
 */
getYear = (total) => {
    var name;
    if (total < 10 ) name = "Freshman";
    else if (total < 20) name = "Sophomore";
    else if (total < 30) name = "Junior";
    else name = "Senior";
    return name;
}

// setYear = (rank) => {
//     rank.role = getYear(rank.total, rank.message);
//     return rank;
// }

/**
 * Rank object contains information about the ranks for the modes of the user as well as the user id
 */
class Rank {
    /**
     * Instantiates a rank object, except when there is an error
     * @param {tower control} TC 
     * @param {splat zones} SZ 
     * @param {rainmaker} RM 
     * @param {clam blitz} CB 
     * @param {message sent by the user} message 
     * @throws error containing message for invalid input
     * @return str if there is an error, will have the associated error message
     */
    constructor(TC, SZ, RM, CB, message) {
        if (typeof message != "string") {
            if (roles == undefined) initial(message);
            this.id = message.member.id;
        } else this.id = message;
        this.total = calcTotal(TC, SZ, RM, CB);
        this.role = roles.find(role => role.name === getYear(this.total));
        this.TC = TC;
        this.SZ = SZ;
        this.RM = RM;
        this.CB = CB;

    }

    /**
     * Sets a specific mode's rank using user's data from ranks array
     * @param {Mode that user is setting} mode 
     * @param {Rank to be setting the mode's rank to} rank 
     */
    set(mode, rankName) {
        mode = mode.toUpperCase();
        rankName = rankName.toUpperCase();
        checkRank(rankName);
        if (this[mode] == undefined) throw "Invalid mode.";
        else if (mode === "message") throw "Stop trying to break the bot, hacker!!";
        this[mode] = rankName;
        this.total = calcTotal(this.TC, this.SZ, this.RM, this.CB);
    }

    /**
     * Sets the class of the student (freshman, sophomore, etc.)
     */
    setYear() {
        this.role = roles.find(role => role.name === getYear(this.total));
    }
}

module.exports = Rank;
