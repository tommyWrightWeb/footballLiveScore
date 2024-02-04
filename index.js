$(document).ready(async function () {
  const competitions = await getCompetitions();
  buildNav(competitions);
});

$('#headersAndTables').hide();

//Makes an API call to an endpoint that retrives Competitions
function getCompetitions() {
  return new Promise((resolve, reject) => {
    var settings = {
      "url": "https://api.football-data.org/v4/competitions",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "X-Auth-Token": "930e89b7f4ce47c8b9a3d5f735afd05a"
      },
    };

    $.ajax(settings).done(function (response) {
      resolve(response);
    });
  });
}

//Makes an API call to an endpoint that retrives league standings
function getStandings(code) {
  return new Promise((resolve, reject) => {
    var settings = {
      "url": `https://api.football-data.org/v4/competitions/${code}/standings`,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "X-Auth-Token": "930e89b7f4ce47c8b9a3d5f735afd05a"
      },
    };

    $.ajax(settings)
      .done(function (response) {
        // This code will be executed when the API call is successful
        resolve(response);
      })
      .fail(function (error) {
        // This code will be executed if the API call encounters an error
        console.error('API call failed:', error);
        reject(error);
      })
      .always(function () {
        // This code will be executed regardless of success or failure
        // Show the #headersAndTables element
        $('#headersAndTables').show();
      });
  });
}


//Makes an API call to an endpoint that retrives leagues top scorers
function getScorers(code) {
  return new Promise((resolve, reject) => {
    var settings = {
      "url": `https://api.football-data.org/v4/competitions/${code}/scorers`,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "X-Auth-Token": "930e89b7f4ce47c8b9a3d5f735afd05a"
      },
    };

    $.ajax(settings).done(function (response) {
      resolve(response);
    });
  });
}

// Makes an API call to an endpoint that retrieves today's fixtures
function getFixtures(code) {
  return new Promise((resolve, reject) => {
    var settings = {
      "url": `https://api.football-data.org/v4/matches`,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "X-Auth-Token": "930e89b7f4ce47c8b9a3d5f735afd05a"
      },
    };

    $.ajax(settings).done(function (response) {
      if (response.matches && response.matches.length > 0) {
        // Create a dynamic table
        const table = $('<table>').addClass('fixtures-table');
        const headerRow = $('<tr>').appendTo(table).attr("style", "border-bottom: 1px solid #ccc;");
        
        $('<th>').text('Area').appendTo(headerRow);
        $('<th>').text('').appendTo(headerRow);
        $('<th>').text('Home Team').appendTo(headerRow);
        $('<th>').text('').appendTo(headerRow);
        $('<th>').text('Away Team').appendTo(headerRow);
        $('<th>').text('').appendTo(headerRow);
        
        // Populate table with fixture data
        response.matches.forEach(match => {
          const row = $('<tr>').appendTo(table).attr("style", "border-bottom: 1px solid #ccc;");
        
          $("<td>")
            .append($("<img>").attr("src", match.area.flag).addClass("flag-img"))
            .appendTo(row)
            .attr("style", "max-height: 60px; max-width: 60px; margin-left:50px; padding: 15px 0;");
        
          $("<td>")
            .append($("<img>").attr("src", match.homeTeam.crest).addClass("flag-img"))
            .appendTo(row)
            .attr("style", "max-height: 60px; max-width: 60px; margin-left:50px; padding: 15px 0;");
        
          $('<td>').text(match.homeTeam.name).appendTo(row).attr("style", "padding: 15px 0;");
          $('<td>').text('VS').appendTo(row).attr("style", "padding: 25px ;");
          $('<td>').text(match.awayTeam.name).appendTo(row).attr("style", "padding: 15px 0;");
        
          $("<td>")
            .append($("<img>").attr("src", match.awayTeam.crest).addClass("flag-img"))
            .appendTo(row)
            .attr("style", "max-height: 60px; max-width: 60px; padding: 15px 0;");
        });
        
       
        $('#fixtures').append(table);
      } else {
        console.log('No matches found.');
      }

      resolve(response);
    }).fail(function (error) {
      console.error('API call failed:', error);
      reject(error);
    });
  });
}






getFixtures('yourCode')
  .then(result => {

  })
  .catch(error => {
  });



function buildNav(competitions) {
  let html = '';

  competitions.competitions.forEach(element => {
    html += `<li class="mr-6 my-2 md:my-0">
      <a href="#" class="block py-1 md:py-3 pl-1 align-middle text-pink-600 no-underline hover:text-gray-900 border-b-2 border-orange-600 hover:border-orange-600">
        <i class="fas fa-home fa-fw mr-3 text-pink-600"></i><span onclick="setPage('${element.code}', '${element.emblem}', '${element.name}')" class="pb-1 md:pb-0 text-sm">${element.name}</span>
      </a>
    </li>`;
  });

  $("#main-nav").html(html);
}

async function setPage(code, img, name) {
  const standings = await getStandings(code);
  $("#total-revenue").text(code);
  $("#league-img").attr("src", img);
  $("#league-code").text(name);
  $("#matchDay").text(standings.season.currentMatchday);
  $("#season").text(standings.filters.season);
 $("#country").text(standings.area.name);
 $("#country-img").attr("src", standings.area.flag);
 $(function() {
  
  $("#leader-img").attr("src", standings.standings[0].table[0].team.crest);
});


 $("#leader").text(standings.standings[0].table[0].team.name);

 let totalGoals = 0;

  standings.standings[0].table.forEach((club) => {
    totalGoals += club.goalsFor;
  });
  $("#total-goals").text(totalGoals);
 
  // Clear the existing content of the #team and #scorers elements
  $("#team, #scorers").empty();

  // Assuming standings is an array, iterate through it
  for (let standing of standings.standings) {
    // Assuming each standing has a 'table' property
    if (standing.table && standing.table.length > 0) {
      // Create an HTML table with the 'team-table' class
      let tableHtml = `<table class="team-table" id="team-table-${standing.stage}"><thead><tr><th style="padding: 10px; border-bottom: 1px solid #ccc;">Position</th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Team</th><th style="padding: 10px; border-bottom: 1px solid #ccc;"></th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Played</th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Won</th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Draw</th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Lost</th><th style="padding: 10px; border-bottom: 1px solid #ccc;">Points</th></tr></thead><tbody>`;

      for (let table of standing.table) {
        // Check if the 'team' property exists and has a 'name' property
        if (table.team && table.team.name) {
          // Add a table row for each team with a border-bottom
          tableHtml += `<tr style="border-bottom: 1px solid #ccc;"><td style="padding: 10px;">${table.position}</td><td style="padding: 10px;">
          <img src="${table.team.crest}" alt="${table.team.name}" style="max-height: 60px; max-width: 60px;"></td>
          <td style="padding: 10px;">${table.team.name}</td><td style="padding: 10px;">${table.playedGames}</td>
          <td style="padding: 10px;">${table.won}</td><td style="padding: 10px;">${table.draw}</td>
          <td style="padding: 10px;">${table.lost}</td><td style="padding: 10px;">${table.points}</td></tr>`;
        }
      }

      // Close the table tags
      tableHtml += '</tbody></table>';

      // Append the table to the #team element
      $("#team").append(tableHtml);
    }
  }

  // Call the setScorers function
  setScorers(code);
}

// Move the setScorers function outside of the setPage function
async function setScorers(code) {
  const scorers = await getScorers(code);

  // Create an empty string to store the HTML content
  let scorersTableHtml = `<table class="scorers-table"><thead><tr>`;
  scorersTableHtml += `<th style="border-bottom: 1px solid #ccc;">Player</th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;">Team</th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;"></th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;">Played</th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;">Goals</th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;">Assists</th>`;
  scorersTableHtml += `<th style="padding: 10px; border-bottom: 1px solid #ccc;">Penalties</th>`;
  scorersTableHtml += `</tr></thead><tbody>`;
  
  scorers.scorers.slice(0, 10).forEach(scorer => {
    scorersTableHtml += `<tr style="border-bottom: 1px solid #ccc;">`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.player.name}</td>`;
    scorersTableHtml += `<td style="padding: 10px;"><img src='${scorer.team.crest}' style="max-height: 60px; max-width: 60px;"></td>`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.team.name}</td>`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.playedMatches}</td>`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.goals}</td>`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.assists !== null ? scorer.assists : '-'}</td>`;
    scorersTableHtml += `<td style="padding: 10px;">${scorer.penalties !== null ? scorer.penalties : '-'}</td>`;
    scorersTableHtml += `</tr>`;
  });
  
  scorersTableHtml += `</tbody></table>`;
  

  // Append the HTML content to the #scorers element
  $("#scorers").html(scorersTableHtml);
  $(function() {
    $("#topGoalscorer").text(scorers.scorers[0].player.name);
    $("#topScorer-img").attr("src", scorers.scorers[0].team.crest);
    

});

  

}




