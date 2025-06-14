import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
      <body className="bg-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
          </div>
        </div>
      </body>
    </>
  );
}

export default App;
