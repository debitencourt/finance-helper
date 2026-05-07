import './home.css';
import { useOfxTransactions } from '../hooks/useOfxTransactions';
import Header from '../components/header/header';

export default function Home() {
  const { fileInputRef, addTransactionsButton } = useOfxTransactions();

  return (
    <>
      <Header />
      <div className="container-dashboard padding-top">
        <div className="line um margin-auto">
          <div className='content'></div>
          <div className='content'></div>
          <div className='content'></div>
          <div className='content'></div>
        </div>
        <div className="line dois margin-auto">
          <div className='content-1'></div>
          <div className='content-2'></div>
        </div>
        <div className="line tres margin-auto">
        </div>
      </div>
    </>
  );
}