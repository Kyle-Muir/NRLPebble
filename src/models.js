var moment = require('moment');
var Models = (function() {
    function removeRoundFromName(name) {
        return name.substring(name.indexOf(',') + 2);
    }

    function formatKickoff(kickoff) {
        return moment(kickoff).format('ha, MMMM Do');
    }

    function formatBody(formattedKickoff, venue) {
        return '\nKick off: ' + formattedKickoff + '\nVenue: ' + venue;
    }

    function Matchup(item) {
        this.title = removeRoundFromName(item.Match);
        this.kickOff = item.StartDate + 'Z';
        this.venue = item.Venue;
        this.date = moment(this.kickOff).format('MM-DD');
        this.formattedKickoff = formatKickoff(this.kickOff);
        this.body = formatBody(this.formattedKickoff, this.venue);
    }

    return {
        Matchup: Matchup
    };
})();
module.exports = Models;