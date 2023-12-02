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

    // Create link element
    const linkElement = document.createElement('a');
    linkElement.href = urlLink;

    if (textToDisplay) {
        linkElement.textContent = textToDisplay;
    } else if (urlTitle) {
        linkElement.textContent = urlTitle;
    } else {
        this.setFailureNotification('Failed to generate link.');

        return;
    }

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

function setFailureNotification(text) {
    const notificationElement = this.getNotificationElement(text);

    notificationElement.classList.remove('success');
    notificationElement.classList.add('failure');

    this.displayAndHideNotification();
}

function setSuccessNotification(text) {
    const notificationElement = this.getNotificationElement(text);

    notificationElement.classList.remove('failure');
    notificationElement.classList.add('success');

    this.displayAndHideNotification();
}

function displayAndHideNotification() {
    const notificationElement = this.getNotificationElement();

    notificationElement.classList.add('notification-active');

    setTimeout(() => {
        notificationElement.classList.remove('notification-active');
    }, 3000);
}

function getNotificationElement(text = '') {
    const notificationElement = document.getElementById('notification');

    if (text) {
        notificationElement.innerText = text;
    }

    return notificationElement;
}

function clearInputs() {
    document.getElementById('textToDisplay').value = '';
    document.getElementById('urlLink').value = '';
}

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
        });

    return urlTitle;
}
