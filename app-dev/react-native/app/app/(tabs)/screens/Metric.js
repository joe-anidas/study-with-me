import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('miles');

  const getOutputUnit = () => {
    switch (inputUnit) {
      case 'miles':
        return 'km';
      case 'pounds':
        return 'kg';
      case 'gallons':
        return 'liters';
      case 'fahrenheit':
        return 'celsius';
      default:
        return '';    }  };

  const getOutputUnitLabel = () => {
    const outputUnit = getOutputUnit();
    switch (outputUnit) {
      case 'km':
        return 'Kilometers';
      case 'kg':
        return 'Kilograms';
      case 'liters':
        return 'Liters';
      case 'celsius':
        return 'Celsius';
      default:
        return '';    }  };

  const convertToMetric = () => {
    switch (inputUnit) {
      case 'miles':
        return parseFloat(inputValue) * 1.60934;
      case 'pounds':
        return parseFloat(inputValue) * 0.453592;
      case 'gallons':
        return parseFloat(inputValue) * 3.78541;
      case 'fahrenheit':
        return ((parseFloat(inputValue) - 32) * 5) / 9;
      default:
        return 0;
    }
  };

  const convertedValue = convertToMetric();
  const outputUnit = getOutputUnit();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unit Converter</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
          placeholder="Enter value"
        />
        <Picker
          style={styles.picker}
          selectedValue={inputUnit}
          onValueChange={setInputUnit}
        >
          <Picker.Item label="Miles" value="miles" />
          <Picker.Item label="Pounds" value="pounds" />
          <Picker.Item label="Gallons" value="gallons" />
          <Picker.Item label="Fahrenheit" value="fahrenheit" />
        </Picker>
      </View>
      <Text style={styles.resultLabel}>Converted Value:</Text>
      <Text style={styles.result}>
        {isNaN(convertedValue) ? '0' : convertedValue.toFixed(2)} {getOutputUnitLabel()}
      </Text>
    </View>  );};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#289df6',
    marginBottom: 20,   },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    width: 120,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,  },
  result: {
    fontSize: 24,
    marginBottom: 20,  
},});
export default App;
