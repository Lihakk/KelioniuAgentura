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

const PlusIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21l3.5-.9a2 2 0 0 0 .9-.5L20 7l-3-3L4.4 16.6a2 2 0 0 0-.5.9L3 21z" />
    <path d="M14 4l6 6" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 7v5l3 3" />
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

export const RoutesDashboardPage: React.FC = () => {
  const items: LinkItem[] = [
    { to: 'create', title: 'Sukurti Maršrutą', desc: 'Pridėti naują maršrutą', icon: <PlusIcon /> },
    { to: 'preview', title: 'Maršruto Peržiūra', desc: 'Peržiūrėti detales', icon: <EyeIcon /> },
    { to: 'edit', title: 'Maršruto Redagavimas', desc: 'Atnaujinti maršrutus', icon: <PencilIcon /> },
    { to: 'estimate-time', title: 'Laiko Įvertinimas', desc: 'Skaičiuoti trukmę', icon: <ClockIcon /> },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Maršrutų Valdymas</h2>
      <BackButton />
      <nav aria-label="Maršrutų navigacija" className="mt-4">
        <ul role="list" className="space-y-3">
          {items.map((it) => (
            <DashboardLink key={it.to} {...it} />
          ))}
        </ul>
      </nav>
    </div>
  );
};
