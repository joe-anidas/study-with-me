import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useState } from 'react';

interface Marks {
  midterm: number;
  final: number;
  assignment: number;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'Generated' | 'Pending';
  marks: Marks;
}

interface NewMarks {
  midterm: string;
  final: string;
  assignment: string;
}

export default function FacultyDashboard() {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', grade: 'A', status: 'Generated', marks: { midterm: 85, final: 90, assignment: 95 } },
    { id: '2', name: 'Bob Wilson', grade: 'B+', status: 'Pending', marks: { midterm: 75, final: 80, assignment: 85 } },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddMarksModalVisible, setIsAddMarksModalVisible] = useState(false);
  const [isViewReportModalVisible, setIsViewReportModalVisible] = useState(false);
  const [newMarks, setNewMarks] = useState<NewMarks>({
    midterm: '',
    final: '',
    assignment: ''
  });

  const handleAddMarks = (student: Student) => {
    setSelectedStudent(student);
    setNewMarks({
      midterm: student.marks.midterm.toString(),
      final: student.marks.final.toString(),
      assignment: student.marks.assignment.toString()
    });
    setIsAddMarksModalVisible(true);
  };

  const handleSaveMarks = () => {
    if (!selectedStudent) return;
  
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        const updatedMarks = {
          midterm: parseInt(newMarks.midterm) || 0,
          final: parseInt(newMarks.final) || 0,
          assignment: parseInt(newMarks.assignment) || 0
        };
        
        // Calculate grade based on marks (simple example)
        const average = (updatedMarks.midterm + updatedMarks.final + updatedMarks.assignment) / 3;
        let grade = '';
        if (average >= 90) grade = 'A';
        else if (average >= 80) grade = 'B+';
        else if (average >= 70) grade = 'B';
        else if (average >= 60) grade = 'C';
        else grade = 'F';
        
        return {
          ...student,
          marks: updatedMarks,
          grade,
          status: 'Generated' as const // Explicitly type as 'Generated'
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    setIsAddMarksModalVisible(false);
  };

  const handleViewReport = (student: Student) => {
    setSelectedStudent(student);
    setIsViewReportModalVisible(true);
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.grade}>Grade: {item.grade}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleAddMarks(item)}
        >
          <Text style={styles.actionButtonText}>Edit Marks</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            item.status === 'Generated' ? styles.generatedButton : styles.generateButton
          ]}
          onPress={() => item.status === 'Generated' ? handleViewReport(item) : handleAddMarks(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'Generated' ? 'View Report' : 'Generate Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Reports</Text>
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Add Marks Modal */}
      <Modal
        visible={isAddMarksModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddMarksModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Marks for {selectedStudent?.name}</Text>
            
            <Text style={styles.inputLabel}>Midterm Marks:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={newMarks.midterm}
              onChangeText={(text) => setNewMarks({...newMarks, midterm: text})}
              placeholder="Enter midterm marks"
            />
            
            <Text style={styles.inputLabel}>Final Marks:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={newMarks.final}
              onChangeText={(text) => setNewMarks({...newMarks, final: text})}
              placeholder="Enter final marks"
            />
            
            <Text style={styles.inputLabel}>Assignment Marks:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={newMarks.assignment}
              onChangeText={(text) => setNewMarks({...newMarks, assignment: text})}
              placeholder="Enter assignment marks"
            />
            
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsAddMarksModalVisible(false)} color="#999" />
              <Button title="Save" onPress={handleSaveMarks} color="#007AFF" />
            </View>
          </View>
        </View>
      </Modal>

      {/* View Report Modal */}
      <Modal
        visible={isViewReportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsViewReportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report for {selectedStudent?.name}</Text>
            
            <View style={styles.reportDetails}>
              <Text style={styles.reportText}>Midterm: {selectedStudent?.marks.midterm}</Text>
              <Text style={styles.reportText}>Final: {selectedStudent?.marks.final}</Text>
              <Text style={styles.reportText}>Assignment: {selectedStudent?.marks.assignment}</Text>
              <Text style={styles.reportGrade}>Final Grade: {selectedStudent?.grade}</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <Button title="Close" onPress={() => setIsViewReportModalVisible(false)} color="#007AFF" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 20,
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
  grade: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#FF9500',
  },
  generateButton: {
    backgroundColor: '#007AFF',
  },
  generatedButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Inter_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  reportDetails: {
    marginVertical: 15,
  },
  reportText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
    color: '#333',
  },
  reportGrade: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 12,
    color: '#007AFF',
  },
});