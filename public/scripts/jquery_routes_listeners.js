const fakeTimes = [{name: "monday 2pm -3pm", time_slot_id: 1}, {name: "monday 2pm -3pm", time_slot_id: 3}, {name: "monday 2pm -3pm", time_slot_id: 2}]


$(document).ready(function () {

  function deleteBookie(value) {
    console.log("in delete");
    $.ajax({ method: "DELETE", url: `/api/polls/${value}` })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
  }

  console.log("connected");

  $("#html-container").append(landingHTML);
  $("#create-bookie").on("click", landingToForm);

  function landingToForm() {
    $("#create-bookie").off();
    $("#html-container").empty();

    $("#html-container").append(formPage);
    $("#add-timeslot").on('click', function () {
       timeManager()
      });

    $("#form-submission").submit(function (event) {
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: "/api/polls",
        data: bookieObjectBuilder(event, '.form-control', '.time-slot'),
        success: function (response) {
          console.log("The happy", response);
          $("#html-container").empty();
          $("#add-timeslot").off();
          $("#main-form-button").off();
          $("#create-bookie").off();
          formToPostForm(response.rows[0].id, response.rows[0].title);
        },
      });
    });
  }

  function formToPostForm(id, url) {
    const deleteId = id
    const copyURL = 'url'
    $.ajax({ url: `/api/polls/${id}`, method: "GET" }).then((response) => {
      console.log("req sent", response);
      $("#html-container").append(`<h5> ${response.polls[0].name}</h5>
      <h5> ${response.polls[0].description}</h5>
      <p>${response[0].location}</p>`);
    });
    $("#html-container").append(preVotePage);
    $("#delete-bookie").on("click", function () {
      console.log('id----', deleteId, 'url----', copyURL);
      deleteBookie(deleteId);
    });
    // still problems with the button
    $("#copy-bookie").click(function () {
      copyToClipboard(copyURL);
    });
    $("#link-tag").click(function (e) {
      postFormToVote()
    });
  }

  function postFormToVote() {
    $("#html-container").empty();
    $("#copy-bookie").off();
    $("#delete-bookie").off();
    $("#link-tag").off();
    $("#html-container").append(votesPage)
    $("#time-slot-container").append(timeSlotBuilder(fakeTimes))


    //NEED TO CONFIRM WHEN PG ROUTE IS WRITTEN
    $("#vote-form").submit( function (event) {
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: "/api/votes",
        data: bookieObjectBuilder(event, ".vote-control", ".vote-choices"),
        success: function (response) {
          console.log(response)
          $("#html-container").empty();
        voteToResult();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert("Your vote didnt work try again");
          voteToResult();
        }
      })
    })
  }

  function voteToResult() {

    $("#html-container").empty();
    $("#vote-form").off();
    $("#html-container").append(resultsPage)
    $("#vote-table-conatiner").append(voteTable(fakeTimes))
    $("#token-check").submit( function (event) {
      event.preventDefault()
      $('#revote-container').append(formPopOut)
      $("#time-slot-container").append(timeSlotBuilder(fakeTimes))
      $("#append-vote-button").off()
    })
    $("#append-vote-form").submit( function (event) {
      event.preventDefault();
      $.ajax({
        type: "POST",
        url: "/api/polls/votes",
        data: bookieObjectBuilder(event, ".vote-control", ".vote-choices"),
        success: function (response) {

          console.log(response)
          $("#re-vote-form").off()
          $("#html-container").empty();
          $("#html-container").append(resultsPage)
        voteToResult();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

          console.log(errorThrown)
          alert("You re-vote didnt work try again");


       }
    })
    })
  }



});