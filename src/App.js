import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const localStorageNotifications = JSON.parse(
      localStorage.getItem('notifications')
    );
    if (!localStorageNotifications) {
      setNotifications([]);
    } else {
      setNotifications(localStorageNotifications);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    function refreshView() {
      setNotifications(JSON.parse(localStorage.getItem('notifications')));
    }

    window.addEventListener('notification', refreshView);

    return () => window.removeEventListener('notification', refreshView);
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        {loading && <h3>Loading Notifications...</h3>}

        {!loading && notifications.length === 0 && (
          <p>
            You have nothing in your inbox. Make sure you&apos;re logged in to
            Stack Overflow so this inbox populates.
          </p>
        )}

        {notifications.map((notif, key) => {
          return (
            <a
              className='link-to-so'
              href={notif.source}
              rel='noopener noreferrer'
              target='_blank'
              key={key}
            >
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: 0,
                  fontSize: 12,
                  color: 'hsl(220, 13%, 68%)',
                }}
              >
                <span>{notif.type}</span>
                <span>{notif.created}</span>
              </p>
              <p className='App-link' style={{ fontSize: 14, margin: 0 }}>
                {notif.title}
              </p>
              <p style={{ fontSize: 12, margin: 0 }}>{notif.comment}</p>
            </a>
          );
        })}
      </header>
    </div>
  );
}

export default App;
