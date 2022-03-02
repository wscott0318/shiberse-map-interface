import React, { useEffect, useState, useRef } from 'react'

export interface TransactionHistoryData {
    token: string
    amount: number
    price: number
    value: number
}


function Table(props: any ) {
    
    let transactionsArray :TransactionHistoryData[] = [];
    let maxTransactions = 15;
    const [transactionList, setTransactionList] =  useState<TransactionHistoryData[]>([]);
    useEffect( () => {

        const timer = setInterval(() => {
            //setSeconds(seconds + 1);
            //console.log("Table222", transactionsArray);
            setTransactionList(
                addTransaction({
                    token: 'added',
                    amount: Math.floor(Math.pow(Math.random() * 10, 10)),
                    price: Math.random() * 1000,
                    value: Math.random() * 1000,
                })
            )
            
        }, 2000);

        return () => clearInterval(timer);

    },[])

    const addTransaction = (transaction: TransactionHistoryData) => {
        transactionsArray.unshift(transaction)
  
        if (transactionsArray.length > maxTransactions) {
          transactionsArray.length = maxTransactions
        }
        return transactionsArray;
        
    }
    //console.log("transaction123",transactionList );
    return (
        <>
            <div className="history">
                <table>
                <thead>
                    <tr>
                    <td style={{width: '70px'}}>Token</td>
                    <td style={{width: '100px'}}>Amount</td>
                    <td>Price</td>
                    <td>Value</td>
                    </tr>
                </thead>

                <tbody>
                    {transactionList.map((transaction,index)=>{
                        return(
                        <tr key={index}>
                            <td>{transaction.token}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.value}</td>
                        </tr>    
                        )
                    })

                    }
                    <tr>
                        
                        {/* <td align="left">1</td>
                        <td align="center">2</td>
                        <td align="right">3</td>
                        <td align="right">4</td> */}
                    </tr>
                </tbody>
                </table>
                {/* <div className="footer">
                    <div className="total">Total $10</div>
                </div>  */}
            </div>
            
        </>
    )
}

export default Table;