import { StyleSheet, Button, TextInput, FlatList, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}


export default function TabOneScreen() {

  const [todo, setTodo] = React.useState<string>("");
  const [todos, setTodos] = React.useState<Todo[]>([]);

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, "todos");

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const todos: any[] = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data()
          } as Todo);
        });
        setTodos(todos);
      }
    });

    return () => subscriber();
  }, []);

  const addTodo = async () => {
    const doc = await addDoc(collection(FIRESTORE_DB, "todos"), {
      title: todo,
      completed: false
    });
    setTodo("");
  }

  const renderTodo = ({ item }: { item: Todo }) => {
    const ref = doc(FIRESTORE_DB, "todos", item.id);
    const toggleCompleted = () => {
      updateDoc(ref, {
        completed: !item.completed
      });
    }
    const deleteTodo = () => {
      deleteDoc(ref);
    }

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleCompleted}>
          {item.completed && <Ionicons name="checkmark-circle" size={26} color="green" />} 
          {!item.completed && <Entypo name="circle" size={24} color="white" />}

        </TouchableOpacity>
        <Text style={styles.todoText} >{item.title}</Text>
        <TouchableOpacity onPress={deleteTodo}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  }

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button title="Add Todo" onPress={addTodo} />
        <View style={styles.form}>
          <TextInput style={styles.textInput} placeholder="Add Todo" onChangeText={(text: string) => setTodo(text)} value = {todo} />
          <Button title="Add Todo" onPress={addTodo} disabled={!todo} />
        </View>
        <View>
          {todos.length > 0 && (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={renderTodo}
            />
          )}
        </View>
        
        {/* <Button title="Populate Database" onPress={() => populateDatabase(FIRESTORE_DB)} /> */}
          
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '80%',
    padding: 10,
    color: 'white'
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    width: '100%',
    padding: 10,
    marginVertical: 5
  },
  todoText: {
    color: 'white'
  },
  todoButton: {
    color: 'white'
  }
});
