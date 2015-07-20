var ajax = require('ajax'), 
    ui = require('ui');

var card = new ui.Card({
  title:'NRL Match ups',
  subtitle:'Loading, please wait...'
});

card.show();

function removeRoundFromName(name) {
  return name.substring(name.indexOf(',') + 2);
}
function formatKickoff(kickoff){
  //This references moment.js which is included side-by-side.
  return moment(kickoff).format('ha, MMMM Do');
}

function Matchup(item) {
  this.title = removeRoundFromName(item.Match);
  this.kickOff = item.StartDate + 'Z';
  this.venue = item.Venue;
  this.date = moment(this.kickOff).format('MM-DD')
}

function formatBody(matchUp) {
  return '\nKick off: ' + formatKickoff(matchUp.kickOff) + '\nVenue: ' + matchUp.venue;
}

function onSelect(e, matchUps) { 
  var selectedMatchUp = matchUps[e.itemIndex];
  var detailCard = new ui.Card({
      title: 'Match details',
      subtitle: selectedMatchUp.title,
      body: formatBody(selectedMatchUp),
      scrollable: true
    });
    detailCard.show();
}

var url = 'http://nrlwebservicewrapper.azurewebsites.net/api/nrl';
ajax(
  {
    url: url,
    type: 'json'
  },
  function(data) {
    var matchUps = [];
    data.forEach(function(item) {
      var matchUp = new Matchup(item);
      matchUps.push(matchUp);
    });
    
    matchUps = matchUps.sort(function(item){ return item.date; }).reverse();
    
    var menuItems = [];
    matchUps.forEach(function(item) {
      menuItems.push({
        title: item.title,
        subtitle: formatKickoff(item.kickOff)
      });
    });

    var resultsMenu = new ui.Menu({
      sections: [{
        title: 'Round Match Ups',
        items: menuItems
      }]
    });
    
    resultsMenu.on('select', function(e) {
         onSelect(e, matchUps);
    });
   
    resultsMenu.show();
    card.hide();
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