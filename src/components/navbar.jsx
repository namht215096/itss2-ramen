import { Link } from 'react-router-dom';
import { LayoutGrid, PiggyBank, Plus, GraduationCap, MoreHorizontal } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutGrid, to: '/dashboard' },
    { label: 'Budget', icon: PiggyBank, to: '/budget', active: true },
    { label: 'Add', icon: Plus, to: '/add' },
    { label: 'Advices', icon: GraduationCap, to: '/advices' },
    { label: 'More', icon: MoreHorizontal, to: '/more' },
];

export default function Navbar() {
    return (
        <nav className="fixed bottom-0 w-full bg-[#00211b] text-sm">
            <div className="flex justify-around items-center py-3">
                {navItems.map(({ label, icon: Icon, to, active }) => (
                    <Link to={to} key={label} className="flex flex-col items-center space-y-1">
                        <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-400'}`} />
                        <span className={`${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}