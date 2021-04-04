import React,{ Component } from 'react';

import { StyleSheet, View,TouchableOpacity,ScrollView} from 'react-native';

import Svg from 'react-native-svg';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {Root, Container, Header, Content, Card, CardItem, Text, Body,Right,Badge,Fab,Button } from 'native-base';

import {VictoryBar,VictoryPie, VictoryChart, VictoryTheme,VictoryAxis,VictoryLegend,VictoryZoomContainer,VictoryLabel } from "victory-native";
//import { ScrollView } from 'react-native-gesture-handler';



class ExpenseChart extends Component{

  constructor(props){

    super(props);
            
     this.state ={
         chartType:{
             pie:true,
             bar:false
         },
         icon_chart_name:'pie-chart',
         chart_selector_active:false        
     }

  }
 

  
  createGraphData=()=>{
        return this.props.expenses_array.map(expense=>{
            return (
                 {
                     name:expense.expenseType.type_name.replace(/\s/g,'\n'), 
                     cost:parseFloat(expense.cumulative_cost.toFixed(2)),
                     count:parseInt(expense.cumulative_count)                     
                 }
            )
        });

        
  }

  createRenderElements=()=>{
    
      let graph_data = this.createGraphData();

       if(graph_data.length>0){

       if(this.state.chartType.bar==true){
    return (
       
           <Svg>       
          <VictoryChart
          standalone={true} 
          domainPadding={20}                    
          containerComponent={<VictoryZoomContainer allowPan={true} allowZoom={true} zoomDimension="x" />} 
          theme={VictoryTheme.material} >

            <VictoryAxis dependentAxis  />
            <VictoryAxis crossAxis fixLabelOverlap style={{
    axis: {stroke: "#756f6a"},
    ticks: {stroke: "grey", size: 5},
    tickLabels: {fontSize: 7, padding: 5}
  }}/>
                               
            {graph_data.map((prop,key)=>{
               return (<VictoryBar  key={key} data={[prop]} x="name" y="cost" style={{ data: { fill: this.props.chart_colors[key], stroke: "#DCDCDC", strokeWidth: 1 }}} events={[{target:"data",eventHandlers:{onPressIn:()=>{this.props.navigation.navigate('ExpensesScreen',{expenseTypeGrouped: this.props.expenses_array[key],expense_color:this.props.chart_colors[key]})}}}]} barRatio={4}/>)
            })}
           
          </VictoryChart>  
          </Svg>      
         
        
      );

    }else if(this.state.chartType.pie==true){

        return (
                   
          <View style={styles.chart_area}>  
          <ScrollView horizontal={true} style={{flex:1,flexDirection:'column'}}>             
          <Svg>         
          <VictoryPie  data={graph_data} x="name" y="cost"  colorScale={this.props.chart_colors}  style={{labels:{fontSize:8,fill:'gray'}}} labelPlacement={()=>''} events={[{target:"data",eventHandlers:{onPressIn:()=>{return[{target:"data",mutation:(props)=>(this.props.navigation.navigate('ExpensesScreen',{expenseTypeGrouped: this.props.expenses_array[props.index],expense_color:this.props.chart_colors[props.index]}))}]}}}]}/></Svg>  
          </ScrollView>           
          </View>
            
          );
      }
    }else{
         return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> 
                 <Text style={{color:'grey'}}>No Expenses found</Text>
              </View>
             
         );  
    }
  }


  createRenderChartLegend(){
       
    let graph_data = this.createGraphData();
         return (
        
          <ScrollView  horizontal={true} style={{flex:1,flexDirection:'row',padding:0}}>
           
           <Svg>
                     
          <VictoryLegend 

          x={10} 
          y={0}
          title="Legend"
           centerTitle
         width={1000}         
         orientation="horizontal"
         colorScale={this.props.chart_colors}
         gutter={15}
         style={{border: {paddingTop:20,stroke: "#DCDCDC" }, title: {fontSize:8} }}
         data={graph_data}
         />
       
           </Svg>
        
         </ScrollView> 
         
         );
  }

   showPieChart=()=>{
        
         this.setState({chartType:{pie:true,bar:false},icon_chart_name:'pie-chart'},this.toggle_chart_selector());
   }

   showBarChart=()=>{
         this.setState({chartType:{pie:false,bar:true},icon_chart_name:'bar-chart'},this.toggle_chart_selector());
   }

   toggle_chart_selector=()=>{
    this.setState({ chart_selector_active: !this.state.chart_selector_active });
   }

  render(){

    return(
      
      <Container>
      <View style={{flex:1,marginTop:0}}>
        <View style={{flex:.1}}>

             {this.createRenderChartLegend()}
             </View>
             <View style={{flex:.9}}>
             {this.createRenderElements()}
             </View>
            
          </View>
          <Fab
            active={this.state.chart_selector_active}
            direction="right"
            containerStyle={{marginTop:35}}
            style={{backgroundColor: 'white',borderWidth:1,borderColor:'#DCDCDC'}}
            position="topLeft"
            onPress={this.toggle_chart_selector }>
            <Icon name={this.state.icon_chart_name} style={{color: '#2196F3',fontSize:20}}/>
            <Button style={{ backgroundColor: 'white' }} onPress={this.showPieChart}>
              <Icon name="pie-chart" style={{color: '#2196F3',fontSize:25}}/>
            </Button>
            <Button style={{ backgroundColor: 'white' }} onPress={this.showBarChart}>
              <Icon name="bar-chart" style={{color: '#2196F3',fontSize:25}}/>
            </Button>            
          </Fab>
          </Container>
     
         
    );

}

}


const styles = StyleSheet.create({
    chart_area: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5fcff",
      padding:0,
      margin:0
    }
  });



export {
    ExpenseChart

 };