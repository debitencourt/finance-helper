import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getTransactions() {
  try {
    const { data, error } = await supabase.from("transactions").select();
    if (error) throw error;
    return data; 
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
}

export async function addTransaction(parsedTransactionsArray) {
  try {
    const formattedData = parsedTransactionsArray.transaction.id.map((item, index) => ({
      id: parsedTransactionsArray.transaction.id[index],
      transaction_date: parsedTransactionsArray.transaction.date[index],
      transaction_amount: parsedTransactionsArray.transaction.amount[index],
      transaction_name: parsedTransactionsArray.transaction.name[index],
      transaction_type: parsedTransactionsArray.transaction.type[index],
      transaction_memo: parsedTransactionsArray.transaction.memo[index]
    }));

    // const { data, error } = await supabase
    //   .from("transactions")
    //   .insert(formattedData);

    // if (error) throw error;
    
    console.log("Successfully added to database!");
    // return data;
  } catch (error) {
    console.error('Failed to add transactions to database:', error);
    return [];
  }
}