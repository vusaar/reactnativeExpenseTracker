import React,{ Component } from 'react';

import { StyleSheet, View,ScrollView} from 'react-native';

import { Container, Header, Content, Footer, FooterTab, Button,Badge, Icon, Text,Fab } from 'native-base';

import DateTimePicker from '@react-native-community/datetimepicker';

import {ORM,ExpenseFactory} from './model/ORM';

import {ExpenseList} from './ExpensesList'

import {ExpenseChart} from './ExpensesChart'


class Home extends Component{

  constructor(props){

    super(props);
    this.expense_orm  = new ORM();

    this.state={
      expenses_array : [],
      date_range :{
      start_date_stamp: new Date().valueOf(),
      end_date_stamp:new Date().valueOf(),
      start_date_picker_visible:false,
      end_date_picker_visible:false,
      },
      show_chart_view:true,
      colors:["#00cecb","#da627d","#eccaff","#c7f9cc","#ffb5a7","#ef476f","#a2d2ff","#ffddd2","#f0eff4", "#caffbf", "#83c5be", "#fdffb6", "#caffbf"]
    }
         
  }
         
  
  async componentDidMount(){
        
    this.props.navigation.addListener('focus', () => { this.initialiseExpenses();});

   this.initialiseExpenses();

  };


  initialiseExpenses(){

    let today =  new Date();
    today.setHours(2,0,0,0);
  
    let start_date_stamp = new Date(today.valueOf()).setDate((today.getDate() - 60)).valueOf();
    let end_date_stamp =  new Date(today.valueOf()).setDate((today.getDate())).valueOf();
         
    this.update_date_range(start_date_stamp,end_date_stamp);

  }


  update_date_range(start_date_stamp,end_date_stamp){
    this.setState({date_range:{start_date_stamp:start_date_stamp,end_date_stamp:end_date_stamp}},this.update_grouped_expsenses);
  }

async  update_grouped_expsenses(){
    let grouped_expenses = await this.expense_orm.get_expense_by_date_type_grouped(this.state.date_range.start_date_stamp,this.state.date_range.end_date_stamp);
    
    this.setState({expenses_array:grouped_expenses});

  }

  onDateRangeChange=(event, new_date)=>{
         

       if(new_date !=null){
         const new_date_stamp =  new Date(new_date).valueOf();        

         if(this.state.date_range.start_date_picker_visible==true){
            
                this.setState(prevState=>({date_range:{
                  ...prevState.date_range,
                  start_date_stamp:new_date_stamp,
                  start_date_picker_visible:false
                }}),this.update_grouped_expsenses);
            
         }else if(this.state.date_range.end_date_picker_visible==true){
          this.setState(prevState=>({date_range:{
            ...prevState.date_range,
            end_date_stamp:new_date_stamp,
            end_date_picker_visible:false
          }}),this.update_grouped_expsenses);
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


   showChartView=()=>{
      
        this.setState({show_chart_view:true});  
  }

  showListView=()=>{
    this.setState({show_chart_view:false});
  }

  getExpensesCost=()=>{
   
    return this.state.expenses_array.reduce((sum,expense,index,[])=>{
       return sum + expense.cumulative_cost;
    },0);
}



  render(){
    return (
      <Container>
      <Content>

      <View style={{flex:1,flexDirection:'column'}}>
      <ScrollView horizontal={true} style={{flex:1,flexDirection:'row',marginRight:10}}>
      <Button iconLeft transparent onPress={()=>{this.showStartDatePicker()}}>
            <Icon name='calendar' style={styles.quick_menu_icon}/>
            <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:2,borderColor:'#2196F3' }}><Text style={styles.quick_menu_text}>From : {new Date(this.state.date_range.start_date_stamp).toLocaleDateString(undefined, {day:'numeric',month: 'short',year:'numeric',})}</Text></Badge>
          </Button>
            
          <Button iconLeft transparent onPress={()=>{this.showEndDatePicker()}}>            
          <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:2,borderColor:'#2196F3' }}><Text style={styles.quick_menu_text}>To : {new Date(this.state.date_range.end_date_stamp).toLocaleDateString(undefined, {day:'numeric',month: 'short',year:'numeric',})}</Text></Badge>
          </Button>

          <Button iconLeft transparent>
          <Icon name='cash' style={styles.quick_menu_icon}/>
          <Badge style={{ backgroundColor: '#F8F8F8',borderWidth:1,borderColor:'gray' }}>
              <Text style={styles.quick_menu_text2}>${this.getExpensesCost().toFixed(2)}</Text>
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
      
      <View style={{ flex: 1,marginBottom:10}}>
        <ScrollView>
        {(this.state.show_chart_view==false) &&
         ( <ExpenseList expenses_array= {this.state.expenses_array} chart_colors={this.state.colors} navigation={this.props.navigation} />)
        }

        {(this.state.show_chart_view==true) &&
         ( <ExpenseChart expenses_array= {this.state.expenses_array} chart_colors={this.state.colors} navigation={this.props.navigation} />)
        }
        </ScrollView>
      </View>
       
        </Content>

        <Fab
            active={false}
            direction="up"
            containerStyle={{borderWidth:0 }}
            style={{ backgroundColor: 'white',opacity:0.85,borderWidth:1,borderColor:'#DCDCDC' ,marginBottom:40}}
            position="bottomRight"
            onPress={() =>
                this.props.navigation.navigate('NewEditExpense',{expense:{id:-1,expense_type_id:-1,date_stamp:new Date().valueOf(),cost:0,notes:'dummy'}})}>
            <Icon name="add" style={{color: '#2196F3',fontSize:25}}/>                                  
          </Fab>
      <Footer style={{backgroundColor:'white'}}>
        <FooterTab style={{backgroundColor:'white'}}>
          <Button vertical onPress={this.showChartView}>
            <Icon name="bar-chart" style={{color: '#2196F3',fontSize:25}}/>
            <Text style={{color: 'gray'}}>Chart</Text>
          </Button>
          <Button vertical onPress={this.showListView}>
            <Icon name="list" style={{color: '#2196F3',fontSize:25}}/>
            <Text style={{color: 'gray'}}>List</Text>
          </Button>
                   
        </FooterTab>
      </Footer>
    </Container>
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
  },

  quick_menu_text:{
    fontSize:12,
    fontWeight:'bold',
    marginHorizontal:5.,
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
 }

});


export {
    Home
 };