// Navbar.jsx
import {
  GraduationCap,
  LayoutGrid,
  MoreHorizontal,
  PiggyBank,
  Plus,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Budget', icon: PiggyBank, active: true },
  { label: 'Add', icon: Plus },
  { label: 'Advices', icon: GraduationCap },
  { label: 'More', icon: MoreHorizontal },
];

export default function Navbar() {
  return (
    <nav className=" sticky bottom-0 w-full bg-[#00211b] text-sm">
      <div className="flex justify-around items-center py-3">
        {navItems.map(({ label, icon: Icon, active }) => (
          <div key={label} className="flex flex-col items-center space-y-1">
            <Icon
              className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-400'}`}
            />
            <span className={`${active ? 'text-white' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
