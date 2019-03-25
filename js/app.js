$(document).ready(function() {

    var rootUrl = "http://localhost:8282/books/";

    loadAllBooks();
    saveBook();

    function loadAllBooks(){
        $("#bookList").empty();
        $.ajax({
            url: rootUrl,
            data: {},
            type: "GET",
            dataType: "json"
            }).done(function(books) { 
                for (var i=0; i<books.length; i++){
                    renderList(books[i]);
                }
                console.log("Loading books process successful");
            }).fail(function() {
                console.log("Loading books process failed");
            });
    }

    function renderList(book){
        var bookList = $("#bookList");
        var bookRecord = $("<li></li>").attr("class", "list-group-item bookRecord").attr("data-id", book.id).text(book.title);
        bookList.append(bookRecord);
        var bookDescription = $("<div></div>").attr("class", "bookDescription").append("<p> ISBN: " + book.isbn + "</p>").append("<p> Author: " + book.author + "</p>").append("<p> Publisher: " + book.publisher + "</p>").append("<p> Type: " + book.type + "</p>").hide();
        bookRecord.append(bookDescription);
        var deleteButton = $("<button>Delete</button>").attr("class", "btn btn-primary delBtn");
        bookDescription.append(deleteButton);
        showDescription();
        deleteBook();
    }


    function showDescription(){
        $(".bookRecord").on("click", function(){
            $(this).find(".bookDescription").toggle();
        })
    }

    function saveBook(){
        $("#saveBtn").on("click", function(event){
            event.preventDefault();
            var newId = Number($(".bookRecord").last().attr("data-id")) + 1;

            var newBook = {
                "id": newId,
                "isbn": $('#isbn').val(),
                "title": $('#title').val(),
                "author": $('#author').val(),
                "publisher": $('#publisher').val(),
                "type": $('#type').val(),
            }
            $.ajax({ 
                url: rootUrl,
                data: JSON.stringify(newBook),
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                }).done(function() { 
                    console.log("Book saved (ID: " + newBook.id + ")");
                    loadAllBooks();
                }).fail(function() {
                    console.log("Book saving failed (book ID: " + newBook.id + ")");
                    loadAllBooks();
                });
        })
    }

    function deleteBook(){
        $(".bookRecord").find(".delBtn").on("click", function(event){
            event.preventDefault();
            var id = Number($(this).parent().parent().attr("data-id"));
            $.ajax({
                url: rootUrl + id,
                data: {},
                type: "DELETE",
                dataType: "json",
                }).done(function() { 
                    console.log("Book deleted (ID = " + id + ")");
                    loadAllBooks();
                }).fail(function() {
                    console.log("Deleting book failed (ID = " + id + ")");
                });
        })
    }
});