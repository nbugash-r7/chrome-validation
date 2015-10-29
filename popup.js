/**
 * Created by nbugash on 29/10/15.
 */
document.addEventListener('DOMContentLoaded', function(request) {
    var validatePageButton = document.getElementById('validatePage');
    validatePageButton.addEventListener('click', function() {
        chrome.tabs.create({
            url: chrome.extension.getURL('validate.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
        });

    }, false);
}, false);