import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  salary: number;
}

export default function ManageEmployees() {
  const [employee, setEmployee] = useState<Employee>({
    id: undefined,
    name: "",
    email: "",
    position: "",
    salary: 0,
  });
  const [employeeId, setEmployeeId] = useState<string>(""); // For delete and update

  const handleChange = (field: keyof Employee, value: string) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: field === "salary" ? Number(value) : value,
    }));
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users", employee);
      Alert.alert("Success", "Employee added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding employee:", error);
      Alert.alert("Error", "Something went wrong while adding the employee.");
    }
  };

  const handleUpdate = async () => {
    if (!employeeId) {
      Alert.alert("Error", "Please enter an employee ID to update.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/users/${employeeId}`,
        employee
      );
      Alert.alert("Success", "Employee updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Error", "Something went wrong while updating the employee.");
    }
  };

  const handleDelete = async () => {
    if (!employeeId) {
      Alert.alert("Error", "Please enter an employee ID to delete.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/users/${employeeId}`
      );
      Alert.alert("Success", "Employee deleted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Error", "Something went wrong while deleting the employee.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Employees</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={employee.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={employee.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Position"
        value={employee.position}
        onChangeText={(value) => handleChange("position", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Salary"
        value={employee.salary.toString()}
        onChangeText={(value) => handleChange("salary", value)}
        keyboardType="numeric"
      />

      <Button title="Add Employee" onPress={handleAdd} />

      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={(value) => setEmployeeId(value)}
        keyboardType="numeric"
      />

      <Button title="Update" onPress={handleUpdate} color="#ffa500" />
      <Button title="Delete" onPress={handleDelete} color="#ff0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
