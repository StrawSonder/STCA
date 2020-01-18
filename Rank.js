//https://regex101.com/r/OrmORY/1

/**
 * Calculates the total associated with those ranks
 * @param rank the rank associated with the mode
 * @return str if there is an error, the associated total if no error
 */
calcTotal = (TC, SZ, RM, CB) => {
    var arr = [TC, SZ, RM, CB];
    var total = 0;
    var str;
    for (var i = 0; i < 4; i++) {
        str = checkRank(arr[i]);
        if (typeof str === "string") return str;
        else total += str;
    }
    return total;
}

/**
 * Checks if the rank is valid
 * @param rank the rank to be checked
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
    
    else if (rank === "S+") return "Please add a number after S+.";
    else return "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\n"
        + "ex. !!register C B A S";
    return total;
}

/**
 * Gets the role associated with the total
 * @param total the total to be used for calculation
 * @return role the role that should be given to the user that has that total
 */
getYear = (total, message) => {
    var freshman = message.guild.roles.find(role => role.name === "Freshman");
    var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
    var junior = message.guild.roles.find(role => role.name === "Junior");
    var senior = message.guild.roles.find(role => role.name === "Senior");
    var role;
    if (total < 10 ) role = freshman;
    else if (total < 20) role = sophomore;
    else if (total < 30) role = junior;
    else role = senior;
    return role;
}

/**
 * Sets a specific mode's rank using user's data from ranks array
 * @param {Mode that user is setting} mode 
 * @param {Rank to be setting the mode's rank to} rank 
 */
set = (mode, rankName, rank) => {
    mode = mode.toUpperCase();
    rankName = rankName.toUpperCase();
    var str = checkRank(rankName);
    if (typeof str === "string") return str;
    if (mode === "TC") rank.TC = rank; 
    else if (mode === "SZ") rank.SZ = rank;
    else if (mode === "RM") rank.RM = rank;
    else if (mode === "CB") rank.CB = rank;
    else return "Invalid mode.";
    rank.setTotal();
    return rank;
}

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
     * @return str if there is an error, will have the associated error message
     */
    constructor(TC, SZ, RM, CB, message) {
        var str = calcTotal(TC, SZ, RM, CB);
        if (typeof str === "string") return str;
        else this.total = str;
        this.role = getYear(this.total, message);
        this.TC = TC;
        this.SZ = SZ;
        this.RM = RM;
        this.CB = CB;
        this.message = message;
    }
    
    /**
     * Sets the total if there is no error
     * @return total if no error, str if error
     */
    setTotal() {
        var str = calcTotal(TC, SZ, RM, CB);
        if (typeof str === "string") return str;
        total = str;
        return str;
    }

    /**
     * Sets the class of the student (freshman, sophomore, etc.)
     */
    setYear() {
        role = getYear(total, message);
    }
}

module.exports = Rank;
