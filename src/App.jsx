import RootRoutes from './routes/index.jsx';
import React from 'react';

function App() {
  return (
    <>
      <body className="bg-gray-100">
        <div className="flex h-screen">
          <React.StrictMode>
            <RootRoutes />
          </React.StrictMode>
        </div>
      </body>
    </>
  );
}

export default App;
