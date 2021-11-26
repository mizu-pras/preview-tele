import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.location.href = "https://www.instagram.com/p/CWuUtDBpj7H/?utm_medium=share_sheet";
  }, []);

  return (
    <div className="App"></div>
  );
}

export default App;
