var ajax          = require('ajax'),
    ui            = require('ui'),
    _             = require('underscore'),
    moment        = require('moment'),
    logger        = require('logger'),
    models        = require('models');

var card = new ui.Card({
    title: 'NRL Match ups',
    subtitle: 'Loading, please wait...'
});

card.show();

function onSelect(e) {
    var selectedMatchUp = e.item;
    var detailCard = new ui.Card({
        title: 'Match details',
        subtitle: selectedMatchUp.title,
        body: selectedMatchUp.body,
        scrollable: true
    });
    detailCard.show();
}

function parseData(data) {
    var matchUps = [];
    data.forEach(function(item) {
        var matchUp = new models.Matchup(item);
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
                subtitle: listItem.formattedKickoff
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

    resultsMenu.on('select', onSelect);
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