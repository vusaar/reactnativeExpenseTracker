import React from 'react'

import * as SQLite from "expo-sqlite"


const expense_db = SQLite.openDatabase('expense.db')

const dropDbAsync = async()=>{
    
    new Promise((resolve, reject) => {
           expense_db.transaction(tx=>{
               tx.executeSql('drop table if exists tblexpense_type');
              
           },(error)=>{reject(error);console.log(error)},(success)=>{resolve(success);console.log('tblexpense_type dropped');console.log(success)});

           expense_db.transaction(tx=>{
            tx.executeSql('drop table if exists tblexpense');
           
        },(error)=>{reject(error);console.log(error)},(success)=>{resolve(success);console.log('tblexpense dropped');console.log(success)});
      });
}

const setUpDbAsync = async ()=>{
      return new Promise((resolve,reject)=>{
          expense_db.transaction(tx=>{
            tx.executeSql('create table if not exists  tblexpense_type (id integer primary key not null,type_name text not null,type_icon text)');
            
          },(error)=>{reject(error);console.log('tblexpense_type create failed');console.log(error)},(success)=>{resolve(success);console.log('tblexpense_type  created');console.log(success)});

          expense_db.transaction(tx=>{           
              tx.executeSql('create table if not exists  tblexpense (id integer primary key not null,expense_type_id integer not null,cost real,description text,date_stamp integer)');
          },(error)=>{reject(error);console.log('tblexpense create failed');console.log(error)},(success)=>{resolve(success);console.log('tblexpense created');console.log(success)});
      })
}

const insertExpenseType = async()=>{
       
      return new Promise((resolve,reject)=>{
          expense_db.transaction(tx=>{
               tx.executeSql('insert into tblexpense_type(type_name,type_icon) values(?,?)',['GROCERIES','SHOPPING-BAG'],(tx,results)=>{
                   console.log('insert results');console.log(results.insertId);
                   resolve(results.insertId);
               })
          })
      })

}


const selectExpense = async()=>{
    
    

} 

export const ExpenseModel ={
    dropDbAsync,
    setUpDbAsync,
    insertExpenseType
}