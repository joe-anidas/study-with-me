import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === '') {
      alert('Please enter a task');
      return;
    }
    const newTask = { id: Date.now().toString(), task, completed: false };
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>To-Do List</Text>
     
      {/* Input field to add new task */}
      <TextInput
        style={styles.textInput}
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
      />
     
      {/* Button to add the task */}
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <View style={styles.taskContainer}>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <View style={styles.taskRow}>
              <TouchableOpacity
                style={[styles.task, item.completed && styles.completedTask]}
                onPress={() => toggleTaskCompletion(item.id)}
              >
                <Text style={[styles.taskText, styles.leftAlignedText]}>{item.task}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },   header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#289df6',
    marginBottom: 20,   },
  textInput: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#289df6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  taskContainer: {
    flex: 1,
    width: '80%',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  task: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  leftAlignedText: {
    textAlign: 'left', // Ensures left alignment
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;



