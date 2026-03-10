import RootRoutes from './routes/index.jsx';
import React from 'react';

function App() {
  return (
    <>
      <body className="min-w-[80rem] bg-gray-100">
        <div className="flex min-h-screen">
          <React.StrictMode>
            <RootRoutes />
          </React.StrictMode>
        </div>
      </body>
    </>
  );
}

export default App;
