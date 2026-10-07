'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-white" />,
});

export default function Page() {
  return <App />;
}

