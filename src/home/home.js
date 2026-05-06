import { useRef } from 'react';
import ofxReader from '../components/ofx-reader';
import { addTransaction } from '../components/supabase';
import './home.css';

function Home() {
  const fileInputRef = useRef(null);

  async function handleOfxUpload(file) {
    try {
      const transactions = await ofxReader(file);
      addTransaction(transactions)
    } catch (error) {
      console.error('Failed to parse OFX file:', error);
    }
  }

  function addTransactionsButton() {
    const file = fileInputRef.current.files[0];
    if(!file) {
      alert('Please select an OFX file to upload.');
      return;
    }
    handleOfxUpload(file);
  }

  return (
    <div className="Home">
      <input type="file" id="ofx-file" accept=".ofx" ref={fileInputRef} />
      <button onClick={addTransactionsButton}>Add Transactions</button>
    </div>
  );
}

export default Home;