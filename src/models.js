var moment = require('moment');
var Models = (function() {
    function removeRoundFromName(name) {
        return name.substring(name.indexOf(',') + 2);
    }

    function Matchup(item) {
        var self = this;
        self.title = removeRoundFromName(item.Match);
        self.kickOff = item.StartDate + 'Z';
        self.venue = item.Venue;
        self.date = moment(self.kickOff).format('MM-DD');
        self.formattedKickoff = moment(self.kickOff).format('h:mma, MMMM Do');
        self.body = function() {
          return '\nKick off: ' + self.formattedKickoff + '\nVenue: ' + self.venue;
        };
    }

    return {
        Matchup: Matchup
    };
})();
module.exports = Models;