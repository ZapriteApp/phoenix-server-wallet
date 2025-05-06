// src/App.js
import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

const App = () => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    fetch('api/authenticate', {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setAuthenticated(true);
        }else {
          setAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Auth check failed:', error);
        setAuthenticated(false);
      });
  }, []);

  return (
    <div className="App">
    {authenticated ? <Dashboard setAuthenticated={setAuthenticated}/> : <Login setIsAuthenticated={setAuthenticated} />}
    </div>
  );
};

export default App;

