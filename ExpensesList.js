import React,{ Component } from 'react';

import { StyleSheet, View,TouchableOpacity,ScrollView} from 'react-native';


import {Root, Container, Header, Content, Card, CardItem, Text, Body,Right,Badge,Button ,Icon} from 'native-base';

import Collapsible from 'react-native-collapsible';


class ExpenseList extends Component{

  constructor(props){

    super(props);
    this.state ={
      expanded_accordions:[]
    }
       
  }


  componentDidMount(){

    this._mounted = true;

    this.props.navigation.addListener('focus', () => { this.initialiseExpandedAccordions();});
    
    this.initialiseExpandedAccordions();
   
  };


  componentWillUnmount(){
      this._mounted = false;
  }

  initialiseExpandedAccordions(){

    
    if(this._mounted===true){
     let  expanded_accordions=[this.props.expenses_array.length];

    this.props.expenses_array.map((expense,key)=>{ 
      
      expanded_accordions[key] = true;    
    });

    this.setState({expanded_accordions:expanded_accordions});
  }
  }


   toggle_accordion(element){
          
    if(this._mounted===true){
       console.log('element '+element+' '+this.state.expanded_accordions[element]);

        let expanded_accordions = [...this.state.expanded_accordions];
        expanded_accordions[element] = ! this.state.expanded_accordions[element];

        this.setState({expanded_accordions:expanded_accordions});
    }
   }

   create_render_elements(){
          
        if(this.props.expenses_array.length>0){
        return this.props.expenses_array.map((expense,key)=>{
             let more_or_less =  this.state.expanded_accordions[key]==true? 'MORE':'LESS';

             console.log(expense);

            return(
            <Card key={key}>
            <CardItem header>
            <Button style={{backgroundColor:this.props.chart_colors[key]}}>
              <Text></Text>
            </Button>
           <Text style={{color:'dimgray',fontWeight:'bold',fontSize:15,marginLeft:3}}>{expense.expenseType.type_name}</Text>
              <Right><Text>${expense.cumulative_cost.toFixed(2)}</Text></Right>
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
             
                <Button   onPress= {() =>{this.props.navigation.navigate('ExpensesScreen',{expenseTypeGrouped: expense,expense_color:this.props.chart_colors[key]})}}  rounded style={{backgroundColor: 'white',fontSize:15,margin:5}}>
                   <Icon name="search-outline" style={{color: '#2196F3',fontSize:15}}/>             
                </Button>

                <Button onPress= {() =>{this.props.navigation.navigate('NewEditExpenseTypeScreen',{expenseType:{id:expense.expenseType.id,type_name:'',type_icon:'',type_color:''}})}} rounded style={{backgroundColor: 'white',fontSize:15,margin:5}}>
                   <Icon name="pencil"  style={{color: '#2196F3',fontSize:15}}/>             
                </Button>
               
            </View>
          </Collapsible>
          </View>
          </CardItem>           
         </Card>)

         });

        }else{
          return (
            <View style={{flex:1,alignItems:'center'}}> 
                 <Text style={{color:'grey',marginTop:150}}>No Expenses found</Text>
              </View>
             
         );  
             
        }

   }

  render(){

      return(        
       
          <View style={{flex:1}}>
             <ScrollView style={{flex:1}}>
               {this.create_render_elements()}
               </ScrollView>
               </View>
           
                  
      );

  }

}


const styles = StyleSheet.create({
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
    ExpenseList

 };