import dynamic from 'next/dynamic';

const DynamicDancingGirl = dynamic(() => import('./DancingGirl'), {
  loading: () => <p>Loading...</p>,
});

export default DynamicDancingGirl;