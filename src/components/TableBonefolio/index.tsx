import React, { useEffect, useState, useRef } from 'react'
import  "../TableBonefolio/tableBonefolio.css";

export interface TransactionHistoryData {
    token: string
    amount: number
    price: number
    percent:number
    value: number
}

function TableBonefolio(props: any ) {
    
    let transactionsArray :TransactionHistoryData[] = [];
    let maxTransactions = 12;
    const [transactionList, setTransactionList] =  useState<TransactionHistoryData[]>([]);
    useEffect( () => {

        const timer = setInterval(() => {
            //setSeconds(seconds + 1);
            console.log("Table222", transactionsArray);
            setTransactionList(
                addTransaction({
                    token: 'added',
                    amount: 1000000,
                    price: 0.000019,
                    percent: 80,
                    value: 1.19,
                })
            )
            
        }, 1000);

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
                    <td className="heading">Token</td>
                    <td className="heading">Amount</td>
                    <td className="heading">Price</td>
                    <td className="heading" style={{width:"15%"}}>%</td>
                    <td className="heading">Value</td>
                    </tr>
                </thead>

                <tbody className="body-style">
                    {transactionList.map((transaction,index)=>{
                        return(
                        <tr className="row-style" key={index}>
                            <td className="row-text">{transaction.token}</td>
                            <td className="row-text">{transaction.amount}</td>
                            <td className="row-text">{transaction.price}</td>
                            <td className="row-text">{transaction.percent}</td>
                            <td className="row-text">{transaction.value}</td>
                        </tr>    
                        )
                    })

                    }
                    {/* <tr>
                        
                        <td align="left">1</td>
                        <td align="center">2</td>
                        <td align="right">3</td>
                        <td align="right">4</td>
                    </tr> */}
                </tbody>
                </table>
                {/* <div className="footer">
                    <div className="total">Total $10</div>
                </div>  */}
            </div>
            
        </>
    )
}

export default TableBonefolio;