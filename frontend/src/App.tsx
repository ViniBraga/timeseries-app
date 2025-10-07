import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import Sidebar from './components/Sidebar';
import { appRoutes } from './constants/routes';
import Dashboard from './pages/dashboard';
import Files from './pages/files';
import { Toaster } from 'sonner';

const App = () => (
  <>
    <Toaster richColors position="top-right" />
    <Router>
      <div className="flex w-screen h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-grow overflow-auto">
          <div className="p-4">
            <Routes>
              <Route path={appRoutes.HOME.path} element={<Dashboard />} />
              <Route path={appRoutes.FILES.path} element={<Files />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  </>
)


export default App
