import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useState } from 'react';

interface Marks {
  midterm: number;
  final: number;
  assignment: number;
}

interface Report {
  id: string;
  subject: string;
  grade: string;
  status: string;
  marks: Marks;
}

interface Student {
  id: string;
  name: string;
  reports: Report[];
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'Alice Johnson',
    reports: [
      { 
        id: '1', 
        subject: 'App Development', 
        grade: 'A', 
        status: 'Generated', 
        marks: { midterm: 85, final: 90, assignment: 95 } 
      },
      { 
        id: '2', 
        subject: 'OOSE', 
        grade: 'B+', 
        status: 'Pending', 
        marks: { midterm: 75, final: 80, assignment: 85 } 
      },
      { 
        id: '3', 
        subject: 'Database Systems', 
        grade: 'A-', 
        status: 'Generated', 
        marks: { midterm: 88, final: 87, assignment: 92 } 
      },
    ]
  });

  const renderReportItem = ({ item }: { item: Report }) => (
    <View style={styles.card}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.grade}>Grade: {item.grade}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <View style={styles.marksContainer}>
        <Text style={styles.marksLabel}>Marks:</Text>
        <Text style={styles.marks}>Midterm: {item.marks.midterm}</Text>
        <Text style={styles.marks}>Final: {item.marks.final}</Text>
        <Text style={styles.marks}>Assignment: {item.marks.assignment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{student.name}'s Academic Reports</Text>
        <Text style={styles.studentId}>ID: {student.id}</Text>
      </View>
      
      <FlatList
        data={student.reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.summary}>
            {student.reports.length} courses • {student.reports.filter(r => r.status === 'Generated').length} finalized
          </Text>
        }
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },
  studentId: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 4,
  },
  summary: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#666',
    marginBottom: 15,
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
  subject: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  grade: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#007AFF',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 5,
  },
  marksContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  marksLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  marks: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
});