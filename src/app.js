var ajax   = require('ajax'),
    ui     = require('ui'),
    _      = require('underscore.js'),
    moment = require('moment.js');

var card = new ui.Card({
    title: 'NRL Match ups',
    subtitle: 'Loading, please wait...'
});

card.show();

function log(item, message) {
    console.log('message: ' + message + ', object as JSON: ' + JSON.stringify(item));
}

function removeRoundFromName(name) {
    return name.substring(name.indexOf(',') + 2);
}

function formatKickoff(kickoff) {
    return moment(kickoff).format('ha, MMMM Do');
}

function Matchup(item) {
    this.title = removeRoundFromName(item.Match);
    this.kickOff = item.StartDate + 'Z';
    this.venue = item.Venue;
    this.date = moment(this.kickOff).format('MM-DD');
}

function formatBody(matchUp) {
    return '\nKick off: ' + formatKickoff(matchUp.kickOff) + '\nVenue: ' + matchUp.venue;
}

function onSelect(e, matchUps) {
    var selectedMatchUp = e.item;
    var detailCard = new ui.Card({
        title: 'Match details',
        subtitle: selectedMatchUp.title,
        body: formatBody(selectedMatchUp),
        scrollable: true
    });
    detailCard.show();
}

function parseData(data) {
    var matchUps = [];
    data.forEach(function(item) {
        var matchUp = new Matchup(item);
        matchUps.push(matchUp);
    });
    return matchUps.sort(function(item) {
        return item.date;
    }).reverse();
}

function createSections(matchUps) {
    var uniqueDates = _.uniq(matchUps, function(item) {
        return item.date;
    });

    var sections = [];
    _.each(uniqueDates, function(item) {
        var itemsByDate = _.filter(matchUps, function(innerItem) {
            return innerItem.date === item.date;
        });
        var menuItems = [];
        _.each(itemsByDate, function(listItem) {
            menuItems.push({
                title: listItem.title,
                subtitle: formatKickoff(listItem.kickOff)
            });
        });

        sections.push({
            title: moment(item.kickOff).format('MMMM Do'),
            items: itemsByDate
        });
    });
    return sections;
}

function createAndShowMenuCard(matchUps) {
    var sections = createSections(matchUps);

    var resultsMenu = new ui.Menu({
        sections: sections
    });

    resultsMenu.on('select', function(e) {
        onSelect(e, matchUps);
    });

    resultsMenu.show();
    card.hide();
}

var url = 'http://nrlwebservicewrapper.azurewebsites.net/api/nrl';
ajax({
        url: url,
        type: 'json'
    },
    function(data) {
        var matchUps = parseData(data);
        createAndShowMenuCard(matchUps);
    },
    function(error) {
        var errorCard = new ui.Card({
            title: 'Error!',
            subtitle: 'Cannot retrieve NRL match ups at this time.',
            scrollable: true
        });
        errorCard.show();
    }
);