/*global chrome*/

chrome.runtime.onInstalled.addListener(() => {
    console.log('Installing background refresh...');
    // create alarm after extension is installed / upgraded
    chrome.alarms.create('refresh', { periodInMinutes: 1 });
    fetchNotifications();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'refresh') {
        fetchNotifications();
    }
});

const newNotificationsEvent = new Event('notification');
function fetchNotifications() {
    fetch('https://stackoverflow.com/topbar/inbox')
      .then(res => res.text())
      .then(res => {
        const parser = new DOMParser();
        const html = parser.parseFromString(res, 'text/html');

        const items = html.getElementsByClassName('inbox-item');
        const unreadItems = html.getElementsByClassName('unread-item');

        if (unreadItems.length > 0) {
            chrome.browserAction.setBadgeText({ text: unreadItems.length.toString() });
            chrome.browserAction.setBadgeTextColor({ color: 'white' });
        }

        let notifications = [];

        for (const item of items) {
          const type = item.getElementsByClassName('item-type')[0];
          const created = item.getElementsByClassName('item-creation')[0];
          const title = item.getElementsByClassName('item-location')[0];
          const comment = item.getElementsByClassName('item-summary')[0];
          const aTag = item.getElementsByTagName('a')[0];

          let url = '';
          let typeForNotif = '';
          let dateForNotif = '';
          let titleForNotif = '';
          let commentForNotif = '';

          if (type != null) {
            let text = type.textContent;
            text = text.replace('Stack Overflow', '');
            typeForNotif = text.trim();
          }

          if (created != null) {
            dateForNotif = created.textContent;
          }

          if (title != null) {
            titleForNotif = title.textContent;
          }

          if (comment != null) {
            commentForNotif = comment.textContent;
          }

          if (aTag != null) {
            url = aTag.href;
          }

          notifications.push({
            type: typeForNotif,
            created: dateForNotif,
            title: titleForNotif,
            comment: commentForNotif,
            source: url
          });
        }

        localStorage.setItem('notifications', JSON.stringify(notifications));

        window.dispatchEvent(newNotificationsEvent);
      });
}
