import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(JSON.parse(localStorage.getItem('notifications')));
  }, []);

  useEffect(() => {
    function refreshView() {
      setNotifications(JSON.parse(localStorage.getItem('notifications')));
    }

    window.addEventListener('notification', refreshView);

    return () => window.removeEventListener('notification', refreshView);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        { notifications.map((notif, key) => {
          return (
            <a
              className="link-to-so"
              href={notif.source}
              rel="noopener noreferrer"
              target="_blank"
              key={key}
              style={{
                padding: 5,
                background: notif.unread && '#344c63'
              }}
            >
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: 0, fontSize: 12, color: 'hsl(220, 13%, 68%)' }}>
                <span>{ notif.type }</span>
                <span>{ notif.created }</span>
              </p>
              <p className="App-link" style={{ fontSize: 14, margin: 0 }}>{ notif.title }</p>
              <p style={{ fontSize: 12, margin: 0 }}>{ notif.comment }</p>
            </a>
          );
        })}
      </header>
    </div>
  );
}

export default App;
