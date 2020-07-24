import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    setNotifications(JSON.parse(localStorage.getItem("notifications")));
    setLoading(false);
  }, []);

  useEffect(() => {
    function refreshView() {
      setNotifications(JSON.parse(localStorage.getItem("notifications")));
    }

    window.addEventListener("notification", refreshView);

    return () => window.removeEventListener("notification", refreshView);
  }, []);

  function handleTheme() {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  return (
    <div className="App">
      <header className={theme === "dark" ? "App-header" : "Light-header"}>
        <div className="switch-container">
          <label className="switch">
            <input type="checkbox" onClick={handleTheme} />
            <span className="slider round"></span>
          </label>
          <p className="theme-indicator">
            <strong>{theme}</strong>
          </p>
        </div>

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
              className="link-to-so"
              href={notif.source}
              rel="noopener noreferrer"
              target="_blank"
              key={key}
            >
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 0,
                  fontSize: 12,
                  color: theme === "dark" ? "hsl(220, 13%, 68%)" : "black",
                }}
              >
                <span>{notif.type}</span>
                <span>{notif.created}</span>
              </p>
              <p className="App-link" style={{ fontSize: 14, margin: 0 }}>
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
