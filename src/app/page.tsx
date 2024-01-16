import FilterableList from '@/components/FilterableList';

const ChipsInputPage: React.FC = () => {
  return (
    <main className='w-screen h-screen flex flex-col items-center space-x-2'>
      <FilterableList placeholder="Type here..." maxHeight="200px"/>
    </main>
  );
};

export default ChipsInputPage;
