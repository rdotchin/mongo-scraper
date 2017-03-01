$(document).ready(function(){

    $('.saved-buttons').on('click',  function () {
        var thisId = $(this).attr("data-value");

        //attach news article _id to the save button in the modal for use in save post
        $("#saveButton").attr({"data-value": thisId});

        //make an ajax call for the notes attached to this article
        $.get("/notes/" + thisId, function(data){
            console.log(data);
            //body of the notes

        })

    });



    $(".savenote").on("click", function(){
        var thisId = $(this).attr("data-value");

        $.ajax({
            method: "POST",
            url: "/notes/" + thisId,
            data: {
                //id of the news article
                _id: thisId,
                //note created by the user
                body: $("#notestext").val().trim()
            }
        }).done(function(data){
            console.log(data);
            //Empty the notes section
            $('#notestext').empty();
        });

    });
});