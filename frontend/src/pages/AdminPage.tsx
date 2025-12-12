import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const ItemIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200">
    {children}
  </span>
);

const ChevronRight = () => (
  <svg
    className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const AdminLink = ({
  to,
  title,
  desc,
  icon,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) => (
  <li>
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <ItemIcon>{icon}</ItemIcon>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <ChevronRight />
    </Link>
  </li>
);

const CalendarCheck = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M9 16l2 2 4-4" />
  </svg>
);

const Suitcase = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="7" width="16" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const RouteIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 8c4 0 8 4 8 8" />
  </svg>
);

const LightBulbIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const AdminDashboard: React.FC = () => {
  const items = [
    {
      to: 'reservations',
      title: 'Peržiūrėti Rezervacijas',
      desc: 'Užsakymai ir mokėjimai',
      icon: <CalendarCheck />,
    },
    {
      to: 'trip',
      title: 'Kelionių Valdymas',
      desc: 'Valdyti visas keliones',
      icon: <Suitcase />,
    },
    {
      to: 'routes',
      title: 'Maršrutų Valdymas',
      desc: 'Tvarkyti maršrutus',
      icon: <RouteIcon />,
    },
    
  ];

  return (
    <nav aria-label="Administratoriaus navigacija" className="p-1">
      <ul role="list" className="space-y-3">
        {items.map((item) => (
          <AdminLink key={item.to} {...item} />
        ))}
      </ul>
    </nav>
  );
};


export const AdminPage: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Administratoriaus Panelė</h1>
      {isDashboard && <AdminDashboard />}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};
