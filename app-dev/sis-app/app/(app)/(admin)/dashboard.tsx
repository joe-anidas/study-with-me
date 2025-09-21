import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';

interface Faculty {
  id: string;
  name: string;
  department: string;
}

interface NewFaculty {
  name: string;
  department: string;
}

export default function AdminDashboard() {
  const [faculty, setFaculty] = useState<Faculty[]>([
    { id: '1', name: 'Dr. John Doe', department: 'Computer Science' },
    { id: '2', name: 'Prof. Jane Smith', department: 'Mathematics' },
  ]);
  
  const [newFaculty, setNewFaculty] = useState<NewFaculty>({ 
    name: '', 
    department: '' 
  });
  
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAddFaculty = (): void => {
    if (!newFaculty.name || !newFaculty.department) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const id = Date.now().toString();
    setFaculty([...faculty, { ...newFaculty, id }]);
    setNewFaculty({ name: '', department: '' });
    setIsAdding(false);
  };

  const handleDeleteFaculty = (id: string): void => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this faculty member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteFaculty(id), style: 'destructive' },
      ]
    );
  };

  const deleteFaculty = (id: string): void => {
    setFaculty(prevFaculty => prevFaculty.filter(item => item.id !== id));
  };

  const renderFacultyItem = ({ item }: { item: Faculty }): JSX.Element => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.department}>{item.department}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteFaculty(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Faculty Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAdding(true)}
        >
          <Text style={styles.addButtonText}>Add Faculty</Text>
        </TouchableOpacity>
      </View>

      {isAdding && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={newFaculty.name}
            onChangeText={(text: string) => setNewFaculty({...newFaculty, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Department"
            value={newFaculty.department}
            onChangeText={(text: string) => setNewFaculty({...newFaculty, department: text})}
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
              onPress={handleAddFaculty}
            >
              <Text style={styles.formButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={faculty}
        renderItem={renderFacultyItem}
        keyExtractor={(item: Faculty) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Styles remain the same as they don't require TypeScript changes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    fontWeight: 'bold',
    color: '#343a40',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  formButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 5,
  },
  department: {
    fontSize: 14,
    color: '#6c757d',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});