import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { appRoutes } from '../constants/routes';
import { Menu, ArrowLeftToLine, ArrowRightToLine, CircleUser } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const drawerWidth = isExpanded ? 'w-60' : 'w-16';

  const menuItems = Object.entries(appRoutes).filter(
    ([, route]) => !route.path.includes(':')
  );

  const onMenuExpandCollapseToggled = () => {
    setIsExpanded((isExpanded) => !isExpanded)
  }

  const onMenuItemSelected = (path: string) => {
    if (window.matchMedia('(max-width: 640px)').matches) {
        setIsExpanded(false)
    }
    navigate(path)
  }

  return (
    <div
      className={`bg-gray-800 text-white h-full flex-shrink-0 transition-all duration-300 flex flex-col h-full ${drawerWidth}`}
    >
      <div className="relative flex items-center justify-between px-4 h-16 bg-gray-900">

        <button
          onClick={onMenuExpandCollapseToggled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="focus:outline-none"
        >
          {isHovered ? (
            isExpanded ? (
                <ArrowLeftToLine />
            ) : (
              <ArrowRightToLine />
            )
          ) : (
            <Menu />
          )}
        </button>

        {isExpanded && (
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 font-semibold text-gray-200 font-mono tracking-tight">
                Timeseries App
            </div>
        )}
      </div>

      {/* Menu Items */}
      <ul className="mt-6 space-y-2">
        {menuItems.map(([key, route]) => (
          <li key={key}>
            <button
              onClick={() => onMenuItemSelected(route.path)}
              className={`flex items-center w-full px-4 py-2 hover:bg-gray-700 ${
                location.pathname === route.path ? 'bg-gray-700' : ''
              }`}
            >
              <span className="material-symbols-outlined mr-2">
                <route.icon />
              </span>
              {isExpanded && <span>{route.title}</span>}
            </button>
          </li>
        ))}
      </ul>

        {/* Dropdown menu for user settings - Does nothing for now */}
        <div className="mt-auto mb-4"> 
          <button className="flex items-center w-full px-4 py-2 hover:bg-gray-700">
            <CircleUser className="mr-2" />
            {isExpanded && <span>User</span>}
          </button>
        </div>
    </div>
  );
}