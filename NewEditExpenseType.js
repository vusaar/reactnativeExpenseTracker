import React,{ Component } from 'react';

import { StyleSheet, View,Text} from 'react-native';

import { Container, Content,Icon,Form,Item, Input, Label ,Picker,Button,Toast } from 'native-base';

import {ORM,ExpenseFactory} from './model/ORM';

import { ExpenseType,Expense,Expense_TypeGrouped} from './model/ORMTypes';

class NewEditExpenseType extends Component{


    constructor(props){
    super(props);

    this.expense_orm  = new ORM();

    this.state={
        
        expenseType:{
            id:-1,
            type_name:'',
            type_icon:'',           
        }
        
    }

    }


    componentDidMount(){

   
      this.props.navigation.addListener('focus', () => { this.initialiseExpenseType();});
      
      console.log('new edit expense did mount');
     
    };
  
 
    async initialiseExpenseType(){
      if(this.props.route.params.expenseType.id > 0){
          
        let expense_types_object =  await this.expense_orm.get_expenseType_by_id(this.props.route.params.expenseType.id);
  
        this.setState({expenseType:{id:expense_types_object.id,type_name:expense_types_object.type_name,type_icon:expense_types_object.type_icon}});

      }
      
    }



    saveExpenseType=async()=>{
         
               if(this.state.expenseType.type_name.trim()!=''){

                let expenseType_object =   new ExpenseType(this.state.expenseType.id,this.state.expenseType.type_name.trim().toUpperCase(),this.state.expenseType.type_icon);

                if( await this.expenseTypeExists()==false){ 

                    if(this.state.expenseType.id== -1){
                        /*
                           insert a new record
                        */
                                                
                           
                          let inserted_id= await this.expense_orm.insert_expenseType(expenseType_object);

                          if(inserted_id > 0){

                            Toast.show({
                                text: "New Expense saved.",
                                buttonText: "Okay"
                              });

                          }else{

                            Toast.show({
                                text: "Unknown error. Nothing saved.",
                                buttonText: "Okay",
                                type: "danger"
                              });
                          }
                      }else{
                        /*
                           its an update
                        */    
                          let updated_count  = await this.expense_orm.update_expenseType(expenseType_object);

                          if(updated_count > 0){

                            Toast.show({
                                text: "Expense updated "+updated_count,
                                buttonText: "Okay"
                              });
                          }else{

                            Toast.show({
                                text: "Unknown error. Nothing saved.",
                                buttonText: "Okay",
                                type: "danger"
                              });

                          }
                    }

                  }else{

                    Toast.show({
                        text: "Expense already exists.",
                        buttonText: "Okay",
                        type: "warning"
                      });
                }

               }else{
                  //show toast
                  Toast.show({
                    text: "Expense name cannot be blank",
                    buttonText: "Okay",
                    type: "warning"
                  });
               }
    }

    expenseTypeExists=async()=>{

       let exists = false;

       let expenseTypesArray = await this.expense_orm.get_expenseType_by_name(this.state.expenseType.type_name.trim().toUpperCase());

       console.log(expenseTypesArray);

       if(expenseTypesArray.length>0){
          if(expenseTypesArray[0].id != this.state.expenseType.id){
            exists = true;
          }
          
       }

       return exists;
    }

    
    onChangeExpenseTypeName = (text)=>{

        this.setState(prevState=>({expenseType:{
            ...prevState.expenseType,
            type_name:text
          }}));
    }
    
    render(){
        return (
            <Container>       
            <Content>
              <Form>                           
                <Item style={styles.form_control}>
                  <Label  style={styles.form_label}>Expense Name</Label>
                  <Input 
                    onChangeText={text => this.onChangeExpenseTypeName(text)}                                                    
                    value={String(this.state.expenseType.type_name)}
                    style={styles.form_input}
                  />
                </Item>
                   
                <Button full info 
                style={{marginTop:40,marginHorizontal:2}}               
                onPress={this.saveExpenseType}
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
    }
  
  });
  
  
  export {
      NewEditExpenseType
   };