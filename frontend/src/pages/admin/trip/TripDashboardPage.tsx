import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../../components/BackButton';

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

const SuitcaseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="7" width="16" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const ListIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="4" cy="6" r="1" />
    <circle cx="4" cy="12" r="1" />
    <circle cx="4" cy="18" r="1" />
  </svg>
);

const PencilIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21l3.5-.9a2 2 0 0 0 .9-.5L20 7l-3-3L4.4 16.6a2 2 0 0 0-.5.9L3 21z" />
    <path d="M14 4l6 6" />
  </svg>
);

type LinkItem = { to: string; title: string; desc: string; icon: React.ReactNode };

const DashboardLink = ({ to, title, desc, icon }: LinkItem) => (
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

export const TripDashboardPage: React.FC = () => {
  const items: LinkItem[] = [
    { to: 'create', title: 'Pridėti Kelionę', desc: 'Naujas pasiūlymas', icon: <SuitcaseIcon /> },
    { to: 'list', title: 'Peržiūrėti Keliones', desc: 'Visų kelionių sąrašas', icon: <ListIcon /> },
    { to: 'edit', title: 'Redaguoti Kelionę', desc: 'Atnaujinti informaciją', icon: <PencilIcon /> },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Kelionių Valdymas</h2>
      <nav aria-label="Kelionių navigacija">
        <ul role="list" className="space-y-3">
          {items.map((it) => (
            <DashboardLink key={it.to} {...it} />
          ))}
        </ul>
      </nav>
    </div>
  );
};
