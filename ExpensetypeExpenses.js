import React,{ Component } from 'react';

import { StyleSheet, View,TouchableOpacity,Alert,ScrollView} from 'react-native';

import { Container, Content,Card,CardItem,Thumbnail, Text, Left, Body, Right, Button,Badge,Icon,Toast } from 'native-base';

import DateTimePicker from '@react-native-community/datetimepicker';

import {ORM,ExpenseFactory} from './model/ORM';

import Collapsible from 'react-native-collapsible';

class ExpensetypeExpenses extends Component{

  constructor(props){

    super(props);
    this.expense_orm  = new ORM();

    this.state = {
      expenseType:this.props.route.params.expenseTypeGrouped.expenseType,
      expenses:[],
      expense_color:this.props.route.params.expense_color,
      date_range:{
        start_date_stamp: this.props.route.params.expenseTypeGrouped.start_date_stamp,
      end_date_stamp:this.props.route.params.expenseTypeGrouped.end_date_stamp,
      start_date_picker_visible:false,
      end_date_picker_visible:false,
      },
      expanded_accordions:[],
    };
    
  }


  async componentDidMount(){

     this._mounted = true;
     
    this.props.navigation.addListener('focus', () => { this.initialiseExpenses();});
    await this.initialiseExpenses();

   
  };

  componentWillUnmount(){
    this._mounted = false;
}

  async initialiseExpenses(){
        
    this.props.navigation.setOptions({title:this.state.expenseType.type_name});
    this.update_expenses();
    
  }


    update_expenses=async()=>{
   
      let expense_objects =  await this.expense_orm.get_expense_by_type_by_date(this.state.expenseType.id,this.state.date_range.start_date_stamp,this.state.date_range.end_date_stamp);

       console.log(this.state.expenseType.id);

      this.setState({expenses:expense_objects},()=>{this.initialiseExpandedAccordions();});

   }


   initialiseExpandedAccordions(){
    
    let  expanded_accordions=[this.state.expenses.length];

   this.state.expenses.map((expense,key)=>{ 
     
     expanded_accordions[key] = true;    
   });

   this.setState({expanded_accordions:expanded_accordions});
 }

 toggle_accordion(element){
          
  console.log('element '+element+' '+this.state.expanded_accordions[element]);

   let expanded_accordions = [...this.state.expanded_accordions];
   expanded_accordions[element] = ! this.state.expanded_accordions[element];

   this.setState({expanded_accordions:expanded_accordions});
}



  create_render_elements(){

      return this.state.expenses.map((expense,key)=>{

        let more_or_less =  this.state.expanded_accordions[key]==true? 'MORE':'LESS';

        return(<Card key={expense.id}>          
          <CardItem header>
          <Button style={{backgroundColor:this.state.expense_color}}>
              <Text></Text>
            </Button>
            <Left><Text>Cost : ${expense.cost.toFixed(2)}</Text></Left>
            <Text>Date : {new Date(expense.date_stamp).toLocaleDateString(undefined, {day:'numeric',month: 'short',year:'numeric',})}</Text>
          </CardItem>
          <CardItem footer>         
         
          <View style={{flex:1,alignSelf:'stretch'}}>
            <TouchableOpacity onPress={()=>this.toggle_accordion(key)} style={styles.accordion_header}>
            <View style={styles.accordion_header}>
              <Text style={{padding:5,fontSize:13}} >
                VIEW {more_or_less}
              </Text>            
            </View>
          </TouchableOpacity>

            <Collapsible
              collapsed={this.state.expanded_accordions[key]}
              align="center"
              style={styles.accordion_body}
             >
            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>

            <Left><Text style={{fontSize:14,color:'gray'}}>{expense.description}</Text></Left>
                             
                <Button onPress= {() =>{this.props.navigation.navigate('NewEditExpense',{expense:{id:expense.id,expense_type_id:expense.expenseType.id,date_stamp:expense.date_stamp,cost:expense.cost,notes:expense.description}})}} rounded style={{backgroundColor: 'white',fontSize:15,margin:5}}>
                   <Icon name="pencil"  style={{color: '#2196F3',fontSize:15}}/>             
                </Button>

                <Button   onPress= {() =>this.promptDeleteExpense(expense.id)}  rounded style={{backgroundColor: 'white',fontSize:15,margin:5}}>
                   <Icon name="trash" style={{color: '#2196F3',fontSize:15}}/>             
                </Button>
               
            </View>
          </Collapsible>
          </View>
          </CardItem>              
        </Card>);
      })     

  }

  
  onDateRangeChange=(event, new_date)=>{
         
    if(new_date !=null){
      const new_date_stamp =  new Date(new_date).valueOf();        

      if(this.state.date_range.start_date_picker_visible==true){
         
             this.setState(prevState=>({date_range:{
               ...prevState.date_range,
               start_date_stamp:new_date_stamp,
               start_date_picker_visible:false
             }}),this.update_expenses);
         
      }else if(this.state.date_range.end_date_picker_visible==true){
       this.setState(prevState=>({date_range:{
         ...prevState.date_range,
         end_date_stamp:new_date_stamp,
         end_date_picker_visible:false
       }}),this.update_expenses);
      }else{

       this.setState(prevState=>({date_range:{
         ...prevState.date_range,            
         end_date_picker_visible:false,
         start_date_picker_visible:false
       }}));
      }
     }

}


showStartDatePicker(){

 this.setState(prevState=>({date_range:{
   ...prevState.date_range,            
   end_date_picker_visible:false,
   start_date_picker_visible:true
 }}));
}

showEndDatePicker(){

 this.setState(prevState=>({date_range:{
   ...prevState.date_range,            
   end_date_picker_visible:true,
   start_date_picker_visible:false
 }}));
}


getExpensesCost=()=>{
   
    return this.state.expenses.reduce((sum,expense,index,[])=>{
       return sum + expense.cost;
    },0);
}


promptDeleteExpense=async(expense_id)=>{
 
  let expense_object = await this.expense_orm.get_expense_by_id(expense_id);

   if(expense_object !=null){

    Alert.alert(
      "Delete",
      "Delete $"+expense_object.cost+' '+this.state.expenseType.type_name,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => this.deleteExpense(expense_id) }
      ]
    );

   }else{
      
    Toast.show({
      text: "Expense not found.",
      buttonText: "Okay",
      type: "warning"
    });
   }
  

}


deleteExpense=async(expense_id)=>{
    let deleted_count =  await this.expense_orm.delete_expense(expense_id);

    if(deleted_count >0){

      Toast.show({
        text: "Deleted successfully :)",
        buttonText: "Okay",
        duration: 4000
      });

      await this.initialiseExpenses();

    }else{

      Toast.show({
        text: "Unknown error. Nothing deleted.",
        buttonText: "Okay",
        type: "warning"
      });
    }
}


   render(){

           
       return(
        <Container>       
        <Content>
        <View style={{flexDirection:'row'}}>
       
      <ScrollView horizontal={true} style={{flex:1,flexDirection:'row',marginRight:10}}>

          <Button iconLeft transparent onPress={()=>{this.showStartDatePicker()}}>
            <Icon name='calendar' style={styles.quick_menu_icon}/>
            <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:1,borderColor:'#2196F3' }}><Text style={styles.quick_menu_text}>From : {new Date(this.state.date_range.start_date_stamp).toLocaleDateString(undefined, {day:'numeric',month: 'short',year:'numeric',})}</Text></Badge>
          </Button>
            
          <Button iconLeft transparent onPress={()=>{this.showEndDatePicker()}}>            
          <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:1,borderColor:'#2196F3' }}><Text style={styles.quick_menu_text}>To : {new Date(this.state.date_range.end_date_stamp).toLocaleDateString(undefined, {day:'numeric',month: 'short',year:'numeric',})}</Text></Badge>
          </Button>

          <Button iconLeft transparent>
          <Icon name='cash' style={styles.quick_menu_icon}/>
          <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:1,borderColor:'gray' }}>
              <Text style={styles.quick_menu_text2}>${this.getExpensesCost().toFixed(2)}</Text>
            </Badge>
            </Button>

            <Button iconLeft transparent>
          <Icon name='logo-buffer' style={styles.quick_menu_icon}/>
          <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:1,borderColor:'gray' }}>
              <Text style={styles.quick_menu_text2}>{this.state.expenses.length}</Text>
            </Badge>
            </Button>

          { (this.state.date_range.start_date_picker_visible===true || this.state.date_range.end_date_picker_visible===true) &&
             (<DateTimePicker
               testID="dateTimePicker"          
               mode="date"
               value={new Date()}
               is24Hour={true}
               display="default"
               onChange={this.onDateRangeChange}          
             />)
              }
          </ScrollView>
        </View>   
            {this.create_render_elements()}
          </Content>
          </Container>
       )
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

  newEdit_Element:{
    padding:10,
    paddingVertical:20
  },

  quick_menu_text:{
    fontSize:12,
    fontWeight:'bold',
    color:'#2196F3'
  },

  quick_menu_text2:{
    fontSize:14,
    fontWeight:'bold',
    marginHorizontal:5.,
    color:'gray'
  },
  quick_menu_icon:{
     fontSize:16,
     color:'gray',
     marginRight:4
  },
  accordion_header: {
    flex: 1,  
    flexDirection:'column',
    
  },

  accordion_body: { 
    flex:1,    
   borderTopColor:'#E0E0E0',
   borderTopWidth:1,  
   alignItems:'stretch'
      
  }

});



export {
  ExpensetypeExpenses
};