import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  PiggyBank,
  Plus,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/Dashboard' },
  { label: 'Budget and Saving', icon: PiggyBank, path: '/budget-and-saving' },
  { label: 'Add Budget', icon: Plus, path: '/add-daily-budget' },
];

export default function Navbar() {
  return (
    <nav className="sticky bottom-0 w-full bg-[#00211b] text-sm">
      <div className="flex justify-around items-center py-3">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${
                isActive ? 'text-white' : 'text-gray-400'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
