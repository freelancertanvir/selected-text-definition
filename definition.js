jQuery(document).ready(function ($) {
    // Add a listener for text selection
    $(document).on('mouseup', function () {
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
        // Create a unique ID for the preview
        var previewId = 'text-preview-' + Date.now();

        // Create a preview div
        var previewDiv = $('<div>', {
            id: previewId,
            class: 'text-preview',
            style: 'border-radius: 8px;',
        });

        // Get the selected range
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var boundingRect = range.getBoundingClientRect();

        // Position the preview below the selected text
        previewDiv.css({
            position: 'absolute',
            top: boundingRect.bottom + window.scrollY + 'px',
            left: boundingRect.left + window.scrollX + 'px',
            backgroundColor: '#f7f7c4',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            transition: 'top 0.3s ease-in-out',
        });

        // Close button
        var closeButton = $('<span>', {
            class: 'close-btn',
            html: '&times;',
            style: 'position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 16px;',
            click: function () {
                hidePreview();
            },
        });

        // Audio element
        var audioElement = $('<audio>', {
            controls: true,
            style: 'width: 100%; margin-bottom: 10px;',
        });

        // Make AJAX request to the API
        $.ajax({
            url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + text,
            method: 'GET',
            success: function (data) {
                // Check if the API returned valid data
                if (Array.isArray(data) && data.length > 0) {
                    // Add word and definitions to the preview div
                    previewDiv.append('<h3>' + data[0].word + '</h3>');
                    data[0].meanings.forEach(function (meaning) {
                        previewDiv.append(
                            '<p><strong>' +
                                meaning.partOfSpeech +
                                ':</strong> ' +
                                meaning.definitions[0].definition +
                                '</p>'
                        );
                    });

                    // Add audio source
                    var audioUrl = data[0].phonetics[0]?.audio || '';
                    if (audioUrl !== '') {
                        audioElement.append('<source src="' + audioUrl + '" type="audio/mpeg">Your browser does not support the audio element.</source>');
                        previewDiv.append(audioElement);
                    }

                    // Append the close button to the preview div
                    previewDiv.append(closeButton);

                    // Append the preview div to the body
                    $('body').append(previewDiv);

                    // Add a click event for words in the preview to show a new preview
                    previewDiv.on('click', 'p', function () {
                        var clickedWord = $(this).text().split(':')[1].trim();
                        showPreview(clickedWord);
                    });

                    // Position the next preview beside the current one
                    var nextPreviewLeft =
                        previewDiv.outerWidth() + boundingRect.left + window.scrollX + 10; // 10px spacing
                    previewDiv.next('.text-preview').css('left', nextPreviewLeft + 'px');
                } else {
                    previewDiv.append('<p>No definition found for ' + text + '</p>');
                }
            },
            error: function () {
                previewDiv.append('<p>Error fetching definition for ' + text + '</p>');
            },
        });
    }

    // Function to hide the preview
    function hidePreview() {
        // Remove all text previews
        $('.text-preview').remove();
    }
});
