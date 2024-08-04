import dynamic from 'next/dynamic';

const PantryManager = dynamic(() => import('../components/PantryManager'), {
  ssr: false
});

export default function Home() {
  return <PantryManager />;
}