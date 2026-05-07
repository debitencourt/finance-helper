import { useRef } from 'react';
import { addTransaction } from '../service/supabase';
import ofxReader from '../components/ofx-reader';

export function useOfxTransactions() {
  const fileInputRef = useRef(null);

  async function handleOfxUpload(file) {
    try {
      const transactions = await ofxReader(file);
      addTransaction(transactions); 
    } catch (error) {
      console.error('Failed to parse OFX file:', error);
    }
  }

  function addTransactionsButton() {
    const file = fileInputRef.current?.files[0]; 
    if(!file) {
      alert('Please select an OFX file to upload.');
      return;
    }
    handleOfxUpload(file);
  }

  //Retornamos o Ref e a Função para o componente poder usar
  return { fileInputRef, addTransactionsButton }; 
}