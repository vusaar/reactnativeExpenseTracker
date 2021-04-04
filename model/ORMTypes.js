 class ExpenseType{
   
    constructor(id,type_name,type_icon){
       
         this.id = id;
         this.type_name = type_name;
         this.type_icon = type_icon;
    }
}

//id integer primary key not null,expense_type_id integer not null,cost real,description text,date_stamp integer
class Expense{

    constructor(id,expenseType,cost,descr,date_stamp){
        this.id = id;
        this.expenseType = expenseType;
        this.cost = cost;
        this.description = descr;
        this.date_stamp = date_stamp;
    }
}


class Expense_TypeGrouped{

        constructor(expenseType,cumulative_cost,cumulative_count,start_date_stamp,end_date_stamp){            
            this.expenseType = expenseType;
            this.cumulative_cost = cumulative_cost;
            this.cumulative_count = cumulative_count;
            this.start_date_stamp = start_date_stamp;
            this.end_date_stamp = end_date_stamp;
        }

}

export{
    ExpenseType,
    Expense,
    Expense_TypeGrouped
};