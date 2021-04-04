import * as SQLite from "expo-sqlite"

import {ExpenseModel} from './ExpenseModel';
import {ExpenseType,Expense,Expense_TypeGrouped} from './ORMTypes'


class ORM{

    constructor(){
        console.log('initializing database');

        this.expense_db = SQLite.openDatabase('expense2.db');

        this.init_tables();
        
    }

    init_tables= async()=>{
        console.log('initializing tables');
        await this.create_tables();
    }

    drop_tables = async =>{

    }

    create_tables = async() =>{
             
      
            this.expense_db.transaction(tx=>{
                 tx.executeSql('Create table if not exists tblexpense_type(id INTEGER PRIMARY KEY NOT NULL, type_name TEXT,type_icon TEXT)',[],()=>{})
            });

            //tblexpense(expense_type_id,cost,description,date_stamp)

            this.expense_db.transaction(tx=>{
                tx.executeSql('Create table if not exists tblexpense(id INTEGER PRIMARY KEY NOT NULL, expense_type_id INTEGER,cost REAL,description TEXT, date_stamp INTEGER)',[],()=>{})
           });
        
    }


    insert_expenseType = async(expenseType)=>{

        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(tx=>{
                 tx.executeSql('insert into tblexpense_type(type_name,type_icon) values(?,?)',[expenseType.type_name,expenseType.type_icon],(tx,results)=>{
                     console.log('insert results');console.log(results.insertId);
                     resolve(results.insertId);
                 })
            })
        })

    }

    get_expenseType_by_id = async(id)=>{


        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select id, type_name,type_icon from tblexpense_type where id= ?',[id],
                    (tx,results)=>{ 
                        //console.log(results);
                        let expenseType_objects_array = ExpenseFactory.make_expenseType_objects(results.rows);
                        resolve(expenseType_objects_array[0]);
                         
                    });
                }
             )
          }
        )


    }


    get_expenseType_by_name = async(type_name)=>{


        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select id, type_name,type_icon from tblexpense_type where type_name= ?',[type_name],
                    (tx,results)=>{ 
                        //console.log(results);
                        let expenseType_objects_array = ExpenseFactory.make_expenseType_objects(results.rows);                        
                        resolve(expenseType_objects_array);
                         
                    });
                }
             )
          }
        )


    }


    get_all_expenseTypes = async()=>{
         
           return new Promise((resolve,reject)=>{
               this.expense_db.transaction(
                   tx=>{
                       tx.executeSql('select id, type_name,type_icon from tblexpense_type',[],
                       (tx,results)=>{ 
                           //console.log(results);
                           let expenseType_objects_array = ExpenseFactory.make_expenseType_objects(results.rows);
                           resolve(expenseType_objects_array);
                            
                       });
                   }
                )
             }
           )

    }

    update_expenseType = async(expenseType)=>{
           
           return new Promise((resolve,reject)=>{
               this.expense_db.transaction(
                   tx=>{
                       tx.executeSql('Update tblexpense_type set type_name=?, type_icon=? where id = ?',[expenseType.type_name,expenseType.type_icon,expenseType.id],(tx,results)=>{
                           resolve(results.rowsAffected);
                       })
                   }
               )
           }

           )
    }


    delete_expenseType = async(id)=>{

         return new Promise((resolve,reject)=>{
             this.expense_db.transaction(
                 tx=>{
                 tx.executeSql('Delete from tblexpense_type where id = ?',[id],(tx,results)=>{
                     resolve(results.rowsAffected);
                 })
                }
             )
           }

         )

    }

    insert_expense = async(expense)=>{

        //id integer primary key not null,expense_type_id integer not null,cost real,description text,date_stamp integer
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(tx=>{
                 tx.executeSql('insert into tblexpense(expense_type_id,cost,description,date_stamp) values(?,?,?,?)',[expense.expenseType.id,expense.cost,expense.description,expense.date_stamp],(tx,results)=>{
                     console.log('insert results');console.log(results.insertId);
                     resolve(results.insertId);
                 })
            })
        })
    }


 
    get_all_expenses = async()=>{

        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense.id, tblexpense.expense_type_id,tblexpense.cost,tblexpense.description,tblexpense.date_stamp,tblexpense_type.id as id2,tblexpense_type.type_name,tblexpense_type.type_icon from tblexpense inner join tblexpense_type on tblexpense.expense_type_id = tblexpense_type.id',[],
                    (tx,results)=>{ 
                        //console.log(results.rows);

                        let expense_objects_array =  ExpenseFactory.make_expense_objects(results.rows);
                        resolve(expense_objects_array);
                    });
                }
            )
        }

        )
    }

    get_expense_by_date = async(start_date_stamp,end_date_stamp) =>{

         
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense.id, tblexpense.expense_type_id,tblexpense.cost,tblexpense.description,tblexpense.date_stamp,tblexpense_type.id as id2,tblexpense_type.type_name,tblexpense_type.type_icon from tblexpense inner join tblexpense_type on tblexpense.expense_type_id = tblexpense_type.id where tblexpense.date_stamp>= ? and tblexpense.date_stamp<= ?',[start_date_stamp,end_date_stamp],
                    (tx,results)=>{ 
                        //console.log(results.rows);

                        let expense_objects_array =  ExpenseFactory.make_expense_objects(results.rows);
                        resolve(expense_objects_array);
                    });
                }
            )
          }

        )
         
    }


    get_expense_by_type = async(expenseType_id)=>{
               
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense.id, tblexpense.expense_type_id,tblexpense.cost,tblexpense.description,tblexpense.date_stamp,tblexpense_type.id as id2,tblexpense_type.type_name,tblexpense_type.type_icon from tblexpense inner join tblexpense_type on tblexpense.expense_type_id = tblexpense_type.id where tblexpense.expense_type_id = ?',[expenseType_id],
                    (tx,results)=>{ 
                        //console.log(results.rows);

                        let expense_objects_array =  ExpenseFactory.make_expense_objects(results.rows);
                        resolve(expense_objects_array);
                    });
                }
            )
          }

        )

    }


    get_expense_by_type_by_date = async(expenseType_id,start_date_stamp,end_date_stamp)=>{
               
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense.id, tblexpense.expense_type_id,tblexpense.cost,tblexpense.description,tblexpense.date_stamp,tblexpense_type.id as id2,tblexpense_type.type_name,tblexpense_type.type_icon from tblexpense inner join tblexpense_type on tblexpense.expense_type_id = tblexpense_type.id where tblexpense.expense_type_id = ? and tblexpense.date_stamp>= ? and tblexpense.date_stamp<= ?',[expenseType_id,start_date_stamp,end_date_stamp],
                    (tx,results)=>{ 
                        //console.log(results.rows);

                        let expense_objects_array =  ExpenseFactory.make_expense_objects(results.rows);
                        resolve(expense_objects_array);
                    });
                }
            )
          }

        )

    }


    get_expense_by_date_type_grouped  = async(start_date_stamp,end_date_stamp)=>{
               
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense_type.id, sum(tblexpense.cost) as cumulative_cost, count(tblexpense.id) as cumulative_count from tblexpense_type join tblexpense on tblexpense.expense_type_id = tblexpense_type.id where tblexpense.date_stamp >=? and tblexpense.date_stamp <=?  group by tblexpense_type.id ',[start_date_stamp,end_date_stamp],
                    (tx,results)=>{ 
                       
                        console.log(results);

                     let expenses_grouped_array =  ExpenseFactory.make_expense_type_grouped_objects(results.rows,start_date_stamp,end_date_stamp,this);  
                        resolve(expenses_grouped_array);
                    },(__,error)=>{console.log(error);},(__,success)=>{console.log("success results : ");console.log(success);});
                }
            )
          }

        )

    }


    get_expense_by_type_date_grouped  = async()=>{
               
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense_type.id, ifnull(sum(tblexpense.id),0) as expense_frequency from tblexpense_type left join tblexpense on tblexpense.expense_type_id = tblexpense_type.id  group by date(tblexpense.date_stamp, "unixepoch")',[],
                    (tx,results)=>{ 
                         
                        console.log(results);
                     //let expenses_grouped_array =  ExpenseFactory.make_expense_type_grouped_objects(results.rows,this);  
                       // resolve(expenses_grouped_array);
                    },(__,error)=>{console.log(error);},(__,success)=>{console.log("success results : ");console.log(success);});
                }
            )
          }

        )

    }


    get_expense_by_id = async(id)=>{
               
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('select tblexpense.id, tblexpense.expense_type_id,tblexpense.cost,tblexpense.description,tblexpense.date_stamp,tblexpense_type.id as id2,tblexpense_type.type_name,tblexpense_type.type_icon from tblexpense inner join tblexpense_type on tblexpense.expense_type_id = tblexpense_type.id where tblexpense.id = ?',[id],
                    (tx,results)=>{ 
                        //console.log(results.rows);

                        let expense_objects_array =  ExpenseFactory.make_expense_objects(results.rows);
                        let expense_object = expense_objects_array.length>0?expense_objects_array[0]:null;
                        resolve(expense_object);
                    });
                }
            )
          }

        )

    }


    update_expense = async(expense)=>{
            
        //id integer primary key not null,expense_type_id integer not null,cost real,description text,date_stamp integer
        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                    tx.executeSql('Update tblexpense set expense_type_id=?, cost=?, description=?,date_stamp=? where id = ?',[expense.expenseType.id,expense.cost,expense.description,expense.date_stamp,expense.id],(tx,results)=>{
                        resolve(results.rowsAffected);
                    })
                }
            )
        })
    }

    delete_expense = async(id)=>{

        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                tx.executeSql('Delete from tblexpense where id = ?',[id],(tx,results)=>{
                    resolve(results.rowsAffected);
                })
               }
            )
        }

        )

    }


    delete_expenses_by_type_id = async(expense_type_id)=>{

        return new Promise((resolve,reject)=>{
            this.expense_db.transaction(
                tx=>{
                tx.executeSql('Delete from tblexpense where expense_type_id = ?',[expense_type_id],(tx,results)=>{
                    resolve(results.rowsAffected);
                })
               }
            )
        }

        )

    }
}








class ExpenseFactory{

       static make_expense_object(id,expense_type_id,type_name,type_icon,cost,description,date_stamp){

           let expenseType = ExpenseFactory.make_expenseType_object(expense_type_id,type_name,type_icon); 

           return new Expense(id,expenseType,cost,description,date_stamp);
       }

       static make_expense_object2(id,cost,description,date_stamp,expenseType){
        
        return new Expense(id,expenseType,cost,description,date_stamp);
       }

       static make_simple_expense_object(id,cost,description,date_stamp){

        let expenseType = ExpenseFactory.make_expenseType_object(expense_type_id,type_name,type_icon); 

        return new Expense(id,expenseType,cost,description,date_stamp);
       }


       static make_expenseType_object(id,type_name,type_icon){
          return new ExpenseType(id,type_name,type_icon);
       }


       static make_expenseType_objects(expenseType_results){

         let expenseType_objects_array = [];

         //id,expense_type_id,type_name,type_icon,cost,description,date_stamp
        for(let i=0;i<expenseType_results.length;i++){

         let expenseType_result = expenseType_results.item(i);

         expenseType_objects_array[i] = ExpenseFactory.make_expenseType_object(expenseType_result.id,expenseType_result.type_name,expenseType_result.type_icon);
        
        }

        return expenseType_objects_array;
       }


       static make_expense_objects(expense_results){
            
           let expense_objects_array = [];

           //id,expense_type_id,type_name,type_icon,cost,description,date_stamp
           for(let i=0;i<expense_results.length;i++){

                 let expense_result = expense_results.item(i);

                 expense_objects_array[i] = ExpenseFactory.make_expense_object(expense_result.id,expense_result.expense_type_id,expense_result.type_name,expense_result.type_icon,expense_result.cost,expense_result.description,expense_result.date_stamp);

           }

           return expense_objects_array;
       }


       static async make_expense_type_grouped_objects(grouped_results,start_date_stamp,end_date_stamp,expense_orm){
           
           let expense_TypeGrouped_array = [];
                    
           for(let i=0;i<grouped_results.length;i++){
               let grouped_result = grouped_results.item(i);
               let expenseType = await expense_orm.get_expenseType_by_id(grouped_result.id);
               expense_TypeGrouped_array[i] = new Expense_TypeGrouped(expenseType,grouped_result.cumulative_cost,grouped_result.cumulative_count,start_date_stamp,end_date_stamp); 
           }   
                    
         return expense_TypeGrouped_array;
     }
}


export {
   ORM,
   ExpenseFactory
};