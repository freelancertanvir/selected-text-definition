jQuery(document).ready(function($) {
    // Variable to store the direction of scrolling
    var isScrollingUp = false;

    // Variable to store the width of the previews
    var totalPreviewWidth = 0;

    // Add a listener for text selection
    $(document).on('mouseup', function() {
        var selectedText = getSelectedText();
        if (selectedText !== '') {
            showPreview(selectedText);
        } else {
            hidePreview();
        }
    });

    // Function to get the selected text
    function getSelectedText() {
        var text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== 'Control') {
            text = document.selection.createRange().text;
        }
        return text.trim();
    }

    // Function to display the preview
    function showPreview(text) {
        // Create a preview div
        var previewDiv = $('<div>', {
            class: 'wordMeaningContainer',
            style: 'display: block; position: fixed; background: rgb(247, 247, 196); color: #333; font-family: Arial, sans-serif; max-width: 300px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); border-radius: 5px; overflow: hidden; transition: top 0.3s ease-in-out;'
        });

        // Get the selected range
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var boundingRect = range.getBoundingClientRect();

        // Position the preview initially at the selected word's bottom
        var topPosition = boundingRect.bottom + window.scrollY;
        var leftPosition = boundingRect.left + window.scrollX + totalPreviewWidth;

        // Check if the preview fits in the viewport vertically
        if (topPosition + previewDiv.height() > window.innerHeight) {
            // If it doesn't fit below, move it to the top
            topPosition = boundingRect.top + window.scrollY - previewDiv.height();
        }

        // Check if the preview fits in the viewport horizontally
        if (leftPosition + previewDiv.width() > window.innerWidth) {
            // If it doesn't fit on the right, adjust its left position
            leftPosition = window.innerWidth - previewDiv.width();
        }

        // Set the calculated positions
        previewDiv.css({
            top: topPosition + 'px',
            left: leftPosition + 'px'
        });

        // Make AJAX request to the API
        $.ajax({
            url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + text,
            method: 'GET',
            success: function(data) {
                // Check if the API returned valid data
                if (Array.isArray(data) && data.length > 0) {
                    var word = data[0].word;
                    var meaning = data[0].meanings[0].definitions[0].definition;
                    var audioUrl = data[0].phonetics[0]?.audio || '';

                    // Add word and meaning to the preview div
                    var wordMeaningDiv = $('<div>', {
                        class: 'wordMeaning',
                        style: 'padding: 15px; text-align: left;'
                    });

                    wordMeaningDiv.append('<h2 style="margin-bottom: 10px;">' + word + '</h2>');
                    wordMeaningDiv.append('<p style="font-size: 16px; line-height: 1.4; margin-bottom: 15px;">' + meaning + '</p>');

                    // Add audio icon
                    if (audioUrl !== '') {
                        wordMeaningDiv.append('<audio controls style="width: 100%; margin-bottom: 10px;"><source src="' + audioUrl + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');
                    }

                    // Add close button
                    wordMeaningDiv.append('<span style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px;" onclick="hidePreview()">✕</span>');

                    previewDiv.append(wordMeaningDiv);

                    // Add click event for words in the preview
                    wordMeaningDiv.find('h2, p').on('click', function() {
                        var clickedWord = $(this).text();
                        showPreview(clickedWord);
                    });

                    // Update the total width of previews
                    totalPreviewWidth += previewDiv.width();
                } else {
                    previewDiv.append('<p style="padding: 15px;">No definition found for ' + text + '</p>');
                }
            },
        });

        // Append the preview div to the body
        $('body').append(previewDiv);

        // Add scrolling behavior
        window.onscroll = function () {
            var vertical_position = 0;
            if (pageYOffset) // usual
                vertical_position = pageYOffset;
            else if (document.documentElement.clientHeight) // IE
                vertical_position = document.documentElement.scrollTop;
            else if (document.body) // IE quirks
                vertical_position = document.body.scrollTop;

            // Check the scrolling direction
            isScrollingUp = vertical_position < topPosition;

            // Adjust the top position of the preview div
            previewDiv.css('top', (topPosition + (isScrollingUp ? -vertical_position : vertical_position)) + 'px');
        };
    }

    // Function to hide the preview
    window.hidePreview = function() {
        $('.wordMeaningContainer').remove();
        // Reset the total width of previews
        totalPreviewWidth = 0;
        // Remove the scrolling behavior when the preview is hidden
        window.onscroll = null;
    }
});
