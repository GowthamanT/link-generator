/**
 * The function generates a link element based on user input, copies it to the
 * clipboard, and displays success or failure notifications.
 *
 * @returns The function does not explicitly return a value.
 */
async function generateLink() {
    // Get input values
    const urlLink = document.getElementById('urlLink').value;
    const textToDisplay = document.getElementById('textToDisplay').value;

    const notificationElement = getNotificationElement();

    // Validate inputs
    if (!urlLink) {
        this.setFailureNotification('Please enter a Url.');

        return;
    }

    const urlTitle = await this.convertUrlToTitle(urlLink);

    if (!textToDisplay && !urlTitle) {
        return;
    }

    // Create link element
    const linkElement = document.createElement('a');
    linkElement.href = urlLink;

    linkElement.textContent = textToDisplay ? textToDisplay : urlTitle;

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.appendChild(linkElement);

    // Append container to the DOM
    document.body.appendChild(tempContainer);

    // Select the container content
    const range = document.createRange();
    range.selectNode(tempContainer);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
        // Execute copy command
        document.execCommand('copy');

        this.setSuccessNotification('Link copied to clipboard!');

        // Clearing the inputs
        this.clearInputs();
    } catch (error) {
        console.error('Copy to clipboard failed:', error);

        this.setFailureNotification(
            'Copy to clipboard failed. See console for more details.'
        );
    }

    // Remove the temporary container
    document.body.removeChild(tempContainer);
}

/**
 * The function sets a failure notification by adding the 'failure' class to a notification element and
 * then displaying and hiding the notification.
 *
 * @param text - The text parameter is a string that represents the failure notification message that
 * you want to display.
 */
function setFailureNotification(text) {
    const notificationElement = this.getNotificationElement(text);

    notificationElement.classList.remove('success');
    notificationElement.classList.add('failure');

    this.displayAndHideNotification();
}

/**
 * The function sets a success notification by adding the 'success' class to a notification element and
 * displaying it.
 *
 * @param text - The text parameter is a string that represents the message or content of the success
 * notification.
 */
function setSuccessNotification(text) {
    const notificationElement = this.getNotificationElement(text);

    notificationElement.classList.remove('failure');
    notificationElement.classList.add('success');

    this.displayAndHideNotification();
}

/**
 * The function displays a notification element and then hides it after 3 seconds.
 */
function displayAndHideNotification() {
    const notificationElement = this.getNotificationElement();

    notificationElement.classList.add('notification-active');

    setTimeout(() => {
        notificationElement.classList.remove('notification-active');
    }, 5000);
}

/**
 * The function returns the notification element with the given text.
 *
 * @param [text] - The `text` parameter is a string that represents the text content that you want to
 * set for the notification element.
 * @returns the notification element with the id 'notification'.
 */
function getNotificationElement(text = '') {
    const notificationElement = document.getElementById('notification');

    if (text) {
        notificationElement.innerText = text;
    }

    return notificationElement;
}

/**
 * The function clears the values of two input fields with the IDs 'textToDisplay' and
 * 'urlLink'.
 */
function clearInputs() {
    document.getElementById('textToDisplay').value = '';
    document.getElementById('urlLink').value = '';
}

/**
 * The function uses the `fetch` API to retrieve the HTML content of a given URL,
 * parses the HTML to extract the title element, and returns the text content of the title element as
 * the URL's title.
 *
 * @param url - The `url` parameter is a string that represents the URL of the webpage whose title we
 * want to retrieve.
 * @returns the title of the webpage specified by the URL.
 */
async function convertUrlToTitle(url) {
    let urlTitle;

    // Use fetch to get the HTML of the page
    await fetch(url)
        .then((response) => response.text())
        .then((html) => {
            // Create a temporary div element to parse the HTML
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Get the title element from the parsed HTML
            var title = tempDiv.querySelector('title');

            urlTitle = title ? title.textContent : '';
        })
        .catch((error) => {
            console.error('Error fetching page:', error);

            this.setFailureNotification(
                `Failed to generate link, Error: "${error}". See the web console for more details.`
            );
        });

    return urlTitle;
}
