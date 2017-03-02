$(document).ready(function(){
    //onclick for
    $('.saved-buttons').on('click',  function () {
        // the NEWS article id
        var thisId = $(this).attr("data-value");

        //attach news article _id to the save button in the modal for use in save post
        $("#saveButton").attr({"data-value": thisId});

        //make an ajax call for the notes attached to this article
        $.get("/notes/" + thisId, function(data){
            //empty modal title, textarea and notes
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');

            //add id of the current NEWS article to modal label
            $('#noteModalLabel').append(' ' + thisId);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.notes.length; i++) {
                $('#notesBody').append(data.notes[i].body);
            }
        });
    });



    $(".savenote").on("click", function(){
        // the NEWS article id
        var thisId = $(this).attr("data-value");
        //ajax POST
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
            //hide the modal when the submit button is clicked
            $('#noteModal').modal('hide');
        });
    });
});