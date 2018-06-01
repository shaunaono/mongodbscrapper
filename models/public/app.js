// Get articles as json
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p");
    }
});

// p tag clicked
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    //Ajax call for Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })

        //Adding Note information
        .then(function (data) {
            console.log(data);
            //title
            $("#notes").append("<h2>" + data.title + "</h2>");
            //input for new title
            $("#notes").append("<input id='titleinput' name='title'>");
            //textarea to add new Note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea");
            //button to submit new Note w/ Article id saved
            $("#notes").append("<button data-id='" + data._id + "'id= 'savenote'>SAVE NOTE</button>");

            //If Note in Article
            if (data.note) {
                //title of Note in title input
                $("#titleinput").val(data.note.title);
                //Put body of Note in body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

//Clicked savenote button
$(document).on("click", "#savenote", function () {
    //Get id assoc w/ article from submit button
    var thisId = $(this).attr("data-id");

    // POST req to change Note using what was entered into inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            //Empty Notes section
            $("#notes").empty();
        });
    //Remove values entered in input and textarea for Note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});