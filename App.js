import 'react-native-gesture-handler';

import React,{ Component } from 'react';



import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

import { Root } from "native-base";

import { StyleSheet, View} from 'react-native';

import * as Font from 'expo-font';

import { Ionicons } from '@expo/vector-icons';

import {ORM,ExpenseFactory} from './model/ORM';

import {Home} from "./Home";

import {ExpensetypeExpenses} from "./ExpensetypeExpenses";

import {NewEditExpense} from "./NewEditExpense";

import {NewEditExpenseType} from "./NewEditExpenseType";


const Stack = createStackNavigator();

class App extends Component{

  constructor(props){

    super(props);

    this.expense_orm  = new ORM();

    //this.componentDidMount();

  }
    
 async componentDidMount(){

  await Font.loadAsync({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    ...Ionicons.font,
  });

  let today =  new Date();
  today.setHours(2,0,0,0);

  let yesterday_time_stamp = new Date(today.valueOf()).setDate((today.getDate() - 200));
  let tomorrow_time_stamp =  new Date(today.valueOf()).setDate((today.getDate() + 200));
       
  let grouped_expenses = await this.expense_orm.get_expense_by_date_type_grouped(yesterday_time_stamp,tomorrow_time_stamp);


  console.log(grouped_expenses);

  let all_expenses =  await this.expense_orm.get_all_expenses();

 // console.log(all_expenses);

    this._mounted = true;

  };

  render(){
    return (
      <Root>
      <NavigationContainer>
     <Stack.Navigator
       screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: '#696969',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize:18
        },
      }}
     >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Categorised Expenses' }}
        />

       <Stack.Screen
          name="NewEditExpense"
          component={NewEditExpense}
          options={{ title: 'Add or Edit Expense' }}
        />

        <Stack.Screen
          name="ExpensesScreen"
          component={ExpensetypeExpenses}
          options={{ title: 'Expenses' }}
        />

        <Stack.Screen
          name="NewEditExpenseTypeScreen"
          component={NewEditExpenseType}
          options={{ title: 'Expense' }}
        />


        
      </Stack.Navigator>
    </NavigationContainer>
    </Root>
    )
  }

}




const styles = StyleSheet.create({
 

  bottom_nav:{
    backgroundColor: '#ffffff',
  },

  newEdit_Element:{
    padding:10,
    paddingVertical:20
  }

});


export default App;