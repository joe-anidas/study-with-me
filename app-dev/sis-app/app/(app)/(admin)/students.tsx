import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  grade: string;
  course: string;
}

interface NewStudent {
  name: string;
  grade: string;
  course: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', grade: '3rd Year', course: 'Computer Science' },
    { id: '2', name: 'Bob Wilson', grade: '2nd Year', course: 'Mathematics' },
  ]);
  const [newStudent, setNewStudent] = useState<NewStudent>({ name: '', grade: '', course: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.course) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const id = Date.now().toString();
    setStudents([...students, { ...newStudent, id }]);
    setNewStudent({ name: '', grade: '', course: '' });
    setIsAdding(false);
  };

  const handleDeleteStudent = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this student?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteStudent(id), style: 'destructive' },
      ]
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.grade} - {item.course}</Text>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteStudent(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Text style={styles.addButtonText}>Add Student</Text>
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={newStudent.name}
            onChangeText={(text) => setNewStudent({...newStudent, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Grade (e.g., 3rd Year)"
            value={newStudent.grade}
            onChangeText={(text) => setNewStudent({...newStudent, grade: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Course"
            value={newStudent.course}
            onChangeText={(text) => setNewStudent({...newStudent, course: text})}
          />
          <View style={styles.formActions}>
            <TouchableOpacity 
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setIsAdding(false)}
            >
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.formButton, styles.saveButton]}
              onPress={handleAddStudent}
            >
              <Text style={styles.formButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
  },
  addForm: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  formButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  formButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  list: {
    gap: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});