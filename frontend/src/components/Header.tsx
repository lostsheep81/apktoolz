import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Icon name="robot" size={24} color="#3B82F6" style={styles.icon} />
        <Text style={styles.title}>APK Analyzer AI</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
          <Icon name="user" size={16} color="#1F2937" />
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.docsButton} onPress={() => {}}>
          <Icon name="book" size={16} color="#FFFFFF" />
          <Text style={styles.docsText}>Docs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  loginText: {
    marginLeft: 8,
    color: '#1F2937',
    fontWeight: '500',
  },
  docsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  docsText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default Header;