
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Picker } from 'react-native';
const ExpenseItem = ({ expense }) => {
  return (
    <View style={styles.transactionContainer}>
      <Text style={styles.transactionDate}>{expense.date}</Text>
      <Text style={styles.transactionAmount}>-${expense.amount.toFixed(2)}</Text>
      <Text style={styles.transactionCategory}>{expense.category || 'Uncategorized'}</Text>
    </View>
  );
};
const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [showIncomeForm, setShowIncomeForm] = useState(true);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [remainingBalance, setRemainingBalance] = useState(0);
  useEffect(() => {
    const totalExpenses = transactions.reduce((total, transaction) => {
      if (transaction.type === 'expense') {
        return total + transaction.amount;
      }
      return total;
    }, 0);
    const balance = weeklyIncome - totalExpenses;
    setRemainingBalance(balance);
  }, [transactions, weeklyIncome]);
  const handleWeeklyIncomeSubmit = () => {
    setWeeklyIncome(parseFloat(amount));
    setAmount('');
    setShowIncomeForm(false);
  };
  const handleTransactionSubmit = () => {
    const newTransaction = {
      id: transactions.length + 1,
      amount: parseFloat(amount),
      type,
      category,
      date,
    };
    setTransactions([...transactions, newTransaction]);
    setAmount('');
    setCategory('');
    setDate(new Date().toLocaleDateString());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Manager </Text>
      <Text style={styles.remainingBalance}>Remaining Balance: ${remainingBalance.toFixed(2)}</Text>
      {showIncomeForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Enter Weekly Income</Text>
          <TextInput
            style={styles.input}
            placeholder="Weekly Income"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Button title="Submit Weekly Income" onPress={handleWeeklyIncomeSubmit} />
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Add Expenses</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Travel" value="Travel" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Miscellaneous" value="Miscellaneous" />
          </Picker>
          <Button title="Add Expense" onPress={handleTransactionSubmit} />
        </View>
      )}
      <FlatList
        data={transactions}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },   
  header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#289df6',
        alignSelf: 'center',
        marginBottom: 20,   },
  formContainer: {
    marginBottom: 20,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  transactionList: {
    marginBottom: 20,
  },
  transactionContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    color: 'gray',  },
  transactionAmount: {
    color: 'red',
  },
  transactionCategory: {
    fontStyle: 'italic',
  },
  remainingBalance: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },});
export default App;
