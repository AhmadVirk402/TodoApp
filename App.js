
import React from 'react';
import {
  SafeAreaView,
  StyleSheet, View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const COLORS={primary:'#1f145c',white:'#fff'}
const App= () => {
  const [textInput,setTextInput]=React.useState('');
  const [todos,setTodos]=React.useState([]);

  React.useEffect(()=>{
   getTodosFromUserDevice();
  },[]);

React.useEffect(()=>{
  saveTodoTouserDevice(todos);
},[todos])

const Listitem=({todo})=>{
  return <View style={styles.Listitem}>
    <View style={{flex:1,}}>
      <Text style={{
        fontWeight:'bold',fontSize:15,
        color:Colors.primary,
        textDecorationLine:todo?.completed?"line-through":'none'
        }}>
        {todo?.task}
        </Text>
      </View>
      {
         !todo.completed &&(
          <TouchableOpacity style={styles.actionIcon} 
          onPress={()=>markTodoComplete(todo?.id)}>
          <MaterialIcons name="done" size={20} color="white"/>
          </TouchableOpacity>
         )
      }
     

      <TouchableOpacity style={[styles.actionIcon,
        {backgroundColor:"red"}]}
        onPress={()=>deleteTodo(todo?.id)}>
      <MaterialIcons name="delete" size={20} color="white"/>
      </TouchableOpacity>
  </View>
};

const saveTodoTouserDevice = async todos=>{ 
  try {
  const stringifyTodos = JSON.stringify(todos)
  await AsyncStorage.setItem('todos',stringifyTodos)
} catch (e) {
  console.log(e);
  // saving error
}
};

const getTodosFromUserDevice = async ()=>{
  try {
    const todos = await AsyncStorage.getItem('todos');
    if(todos !=null){
      setTodos(JSON.parse(todos));
    }
  } catch (error) {
    console.log(error);
  }
};

const addTodo=()=>{
   if(textInput==""){
    Alert.alert('Error','Please input todo');
   } else{ 
    const newTodo={
      id:Math.random(),
      task:textInput,
      completed: false,
    };
  
    setTodos([...todos,newTodo]);
    setTextInput('');
  };
};

const markTodoComplete=(todoId)=>{
 const newTodos=todos.map((item)=>{
  if (item.id == todoId){
   return {...item,completed:true};
  }
  return item
 });
 setTodos(newTodos);
};

const deleteTodo=(todoId)=>{
const newTodos = todos.filter(item=> item.id !=todoId);
setTodos(newTodos);
};

const clearTodos=()=>{
  Alert.alert('Confirm','Clear todos?',[{
    text:"Yes",
    onPress:()=>setTodos([]),
  },
  {text:'No'}
]);
};

return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.white}}>
      <View style={styles.header}>
        <Text style={{
          fontWeight:'bold',
          fontSize:20,
          color:COLORS.primary,
          }}>TODO APP</Text>
          <MaterialIcons name="delete" size={25} color="red"
           onPress={clearTodos}/>
      </View>

      <FlatList 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding:20,paddingBottom:100,}}
      data={todos} 
      renderItem={({item})=> <Listitem todo={item}/>}/>

      <View style={styles.footer}>
        <View style={styles.InputContainer}>
          <TextInput placeholder="Add Todo"
          value={textInput} 
          onChangeText={text=>setTextInput(text)}/>
        </View>
        <TouchableOpacity onPress={addTodo}>
        <View style={styles.IconContainer}>
          <MaterialIcons name="add" color={COLORS.white} size={30}/>
        </View>
      </TouchableOpacity>
      
      </View>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  actionIcon:{
    height:25,
    width:25,
    backgroundColor:'green',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius:3,
  },
  Listitem:{
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10,
  },
header:{
  padding:20,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-between',
},
footer:{
  position:'absolute',
  bottom:0,
  color:COLORS.white,
  width:'100%',
  flexDirection:'row',
  paddingHorizontal:20,
},
InputContainer:{
backgroundColor:COLORS.white,
elevation:40,
flex:1,
height:50,
marginVertical:20,
marginRight:20,
borderRadius:30,
paddingHorizontal:20,
},
IconContainer:{
  height:50,
  width:50,
  backgroundColor:COLORS.primary,
  borderRadius:25,
  elevation:40,
  justifyContent:'center',
  alignItems:'center',
  bottom:-19,
}
});

export default App;
