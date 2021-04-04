import React,{ Component } from 'react';

import { StyleSheet, View,Text,Alert} from 'react-native';

import { Container, Content,Icon,Form,Item, Input, Label ,Picker,Button,Toast } from 'native-base';

import DateTimePicker from '@react-native-community/datetimepicker';

import {ORM,ExpenseFactory} from './model/ORM';

class NewEditExpense extends Component{

  constructor(props){

    super(props);

    this.expense_orm  = new ORM();

    this.state = {
        expense:{
        expense_id:this.props.route.params.expense.id,
        expense_type_id: this.props.route.params.expense.expense_type_id,
        cost:this.props.route.params.expense.cost,
        description: this.props.route.params.expense.notes,
        date_stamp:this.props.route.params.expense.date_stamp,
        human_date:{
            day: this.addZero(new Date(this.props.route.params.expense.date_stamp).getDate()).toString(),
             month:this.addZero((new Date(this.props.route.params.expense.date_stamp).getMonth()+1)).toString(),
             year:new Date(this.props.route.params.expense.date_stamp).getFullYear().toString(),
        },
        date_picker_visible:false,
        save_disabled:false
        },
        
        expenseTypes:[]
    }
  
   


  }
           
  componentDidMount(){

   
    this.props.navigation.addListener('focus', () => { this.initialiseExpenseTypes();});
    
    console.log('new edit expense did mount');
   
  };



  async initialiseExpenseTypes(){
    let expense_types_objects =  await this.expense_orm.get_all_expenseTypes();

    this.setState({expenseTypes:expense_types_objects});
  }


  initialiseExpense=()=>{
        this.setState({expense : {
          expense_id:-1,
          expense_type_id: this.state.expense.expense_type_id,
          cost:0.00,
          description:'',
          date_stamp:new Date().valueOf(),
          human_date:{
              day: this.addZero(new Date().getDate()).toString(),
               month:this.addZero((new Date().getMonth()+1)).toString(),
               year:new Date().getFullYear().toString(),
          },
          date_picker_visible:false,
          save_disabled:false
          } });    
  }

  onExpenseTypeChange(value) {
    this.setState(prevState=>({expense:{
        ...prevState.expense,
        expense_type_id:value
    }
      
    }))
}


addZero=(i)=>{
    if(i<10){
      i = "0" + i;
    }
   return i;
   };

showDatePicker = ()=>{
        
    this.setState(prevState=>({expense:{
      ...prevState.expense,
      date_picker_visible:true
    }}));
}



hideDatePicker =()=>{
    this.setState(prevState=>({expense:{
        ...prevState.expense,
        date_picker_visible:false
      }}));
}

onExpenseDateChange=(event, selectedDate)=>{

    /*
       call this first otherwise the calender will appear first
   */
 this.hideDatePicker();

 const newDate = selectedDate || new Date();

 this.setState(prevState=>({expense:{
  ...prevState.expense,
  date_stamp:newDate.valueOf(),
  human_date:{
    day: this.addZero(newDate.getDate()).toString(),
     month:this.addZero((newDate.getMonth()+1)).toString(),
     year:newDate.getFullYear().toString(),
}
}}));

}


onExpenseCostChange =(new_cost)=>{
    this.setState(prevState=>({expense:{
        ...prevState.expense,
        cost:new_cost
          
    }}));
}


onExpenseDescrChange=(notes)=>{
    this.setState(prevState=>({expense:{
        ...prevState.expense,
        description:notes
          
    }}));
}

saveExpense=async()=>{
      
    this.setState(prevState=>({expense:{
      ...prevState.expense,
      save_disabled:true
    }}));
   
    if(this.state.expense.expense_id < 1){

    let expenseType_object = await this.expense_orm.get_expenseType_by_id(this.state.expense.expense_type_id);

    let expense_object =   ExpenseFactory.make_expense_object2(this.state.expense.expense_id,this.state.expense.cost,this.state.expense.description,this.state.expense.date_stamp,expenseType_object);
    console.log(expense_object);

    let inserted_id = await this.expense_orm.insert_expense(expense_object);

    if(inserted_id>0){

      Toast.show({
        text: "Saved successfully :)",
        buttonText: "Okay",
        duration: 4000
      });

      this.initialiseExpense();

    }else{
      Toast.show({
        text: "Error saving :(",
        buttonText: "Okay"
      });

    }


    console.log('inserted id '+ inserted_id);

  }else{

      let expense_object = await this.expense_orm.get_expense_by_id(this.state.expense.expense_id);

       if(expense_object !=null){

        let expenseType_object = await this.expense_orm.get_expenseType_by_id(this.state.expense.expense_type_id);

          expense_object.cost =  this.state.expense.cost;
          expense_object.description = this.state.expense.description;
          expense_object.date_stamp =  this.state.expense.date_stamp;
          expense_object.expenseType = expenseType_object;
             
          let updated_count =  await this.expense_orm.update_expense(expense_object);

          if(updated_count>0){

            Toast.show({
              text: "Updated successfully :)",
              buttonText: "Okay",
              duration: 4000
            });
      
            //this.initialiseExpense();
          }else{

            Toast.show({
              text: "Error updating :(",
              buttonText: "Okay"
            });
          }
         
       }else{

        Toast.show({
          text: "Error updating. Expense not found :(",
          buttonText: "Okay"
        });
       }
    

  }

    this.setState(prevState=>({expense:{
      ...prevState.expense,
      save_disabled:false
    }}));
}



  render(){
    return (
        <Container>       
        <Content>
          <Form>

          <Item style={styles.form_control2}>
           
                <Button   onPress= {() =>{this.props.navigation.navigate('NewEditExpenseTypeScreen',{expenseType:{id:-1,type_name:'',type_icon:'',type_color:''}})}}  rounded style={{backgroundColor: 'white',fontSize:25,margin:5}}>
                   <Icon name="add" style={{color: '#2196F3',fontSize:20}}/>             
                </Button>

                <Button onPress= {() =>{this.props.navigation.navigate('NewEditExpenseTypeScreen',{expenseType:{id:this.state.expense.expense_type_id,type_name:'',type_icon:'',type_color:''}})}} rounded style={{backgroundColor: 'white',fontSize:25,margin:5}}>
                   <Icon name="pencil"  style={{color: '#2196F3',fontSize:20}}/>             
                </Button>
               
                </Item>

            <Item style={styles.form_control}>
            <Label
             style={styles.form_label}
            >
            Expense Type
            </Label>
            </Item>
           <Item>
            <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{}}
                placeholder="Expense Type..."
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.expense.expense_type_id}
                onValueChange={this.onExpenseTypeChange.bind(this)}
              >
                {this.state.expenseTypes.map((expenseType) => {
                  return (<Picker.Item label={expenseType.type_name} value={expenseType.id} key={expenseType.id}/>);
                 })}
              </Picker>
            </Item>
             
            <Item style={styles.form_control}>
              <Label  style={styles.form_label}>Date</Label>
             
            <Text onPress = {this.showDatePicker}  style={styles.form_input}>
            {this.state.expense.human_date.day}/{this.state.expense.human_date.month}/{this.state.expense.human_date.year}
             </Text>
             { this.state.expense.date_picker_visible===true &&
             (<DateTimePicker
               testID="dateTimePicker"          
               mode="date"
               value={new Date()}
               is24Hour={true}
               display="default"
               onChange={this.onExpenseDateChange}          
             />)
              }
          </Item>


            <Item style={styles.form_control}>
              <Label  style={styles.form_label}>Cost</Label>
              <Input 
                keyboardType='decimal-pad'                
                onChangeText={text => this.onExpenseCostChange(text)}
                value={String(this.state.expense.cost)}
                style={styles.form_input}
              />
            </Item>

            <Item style={styles.form_control}>
              <Label  style={styles.form_label}>Notes</Label>
              <Input                               
                onChangeText={text => this.onExpenseDescrChange(text)}
                value={this.state.expense.description}
                style={styles.form_input}
              />
            </Item>

           
            <Button full info 
            style={{marginTop:40,marginHorizontal:2}}
            disabled = {this.state.expense.save_disabled}
            onPress={this.saveExpense}
            >
              <Text style={{color:'white'}}>SAVE</Text>
            </Button>
          
          </Form>
        </Content>
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottom_nav:{
    backgroundColor: '#ffffff',
  },

  form_input:{
      flex:1,      
    padding:10,
    paddingLeft:20,
    alignSelf:'stretch' 
  },

  form_label:{
    flex:1,
    alignSelf:'flex-start',
    marginTop:15,
    fontSize:14
  },

  form_control:{
    flexDirection:'column',
    justifyContent:'flex-start',        
  },

  form_control2:{
    flexDirection:'row',
    justifyContent:'flex-end', 
    margin:5       
  }

});


export {
    NewEditExpense
 };