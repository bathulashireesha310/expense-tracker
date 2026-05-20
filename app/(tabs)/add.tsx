import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useExpenses } from '../../context/ExpenseContext';
import { useRouter } from 'expo-router';

const CATEGORIES = ['🍔 Food', '🚗 Transport', '🛍️ Shopping', '🏠 Rent', '✨ Other'];
const BUDGET_PRESETS = [15000, 25000, 50000, 100000];
const PAYMENT_METHODS: ('UPI' | 'Cash' | 'Card')[] = ['UPI', 'Cash', 'Card'];

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');

  const { addExpense, budgetLimit, updateBudgetLimit, currency } = useExpenses(); 
  const [localBudget, setLocalBudget] = useState(budgetLimit.toString());
  const router = useRouter();

  useEffect(() => {
    setLocalBudget(budgetLimit.toString());
  }, [budgetLimit]);

  const handleSave = async () => {
    if (!title.trim() || !amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Input Error", "Please supply a valid item title and positive monetary figure.");
      return;
    }

    await addExpense(title.trim(), amount.trim(), category, paymentMethod); 
    
    setTitle('');
    setAmount('');
    setCategory('🍔 Food');
    setPaymentMethod('UPI');
    router.replace('/'); 
  };

  const handleBudgetChange = (val: string) => {
    setLocalBudget(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      updateBudgetLimit(num);
    }
  };

  const handlePresetTap = (value: number) => {
    setLocalBudget(value.toString());
    updateBudgetLimit(value);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* SECTION 1: TARGET CONFIGURATION AT THE TOP */}
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <Text style={styles.label}>Set Monthly Spending Target ({currency})</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={localBudget} onChangeText={handleBudgetChange} placeholder="e.g. 50000"/>

          {/* New Feature: Preset Chips */}
          <View style={styles.presetGrid}>
            {BUDGET_PRESETS.map((preset) => (
              <TouchableOpacity key={preset} style={[styles.presetChip, budgetLimit === preset && styles.presetChipSelected]} onPress={() => handlePresetTap(preset)}>
                <Text style={[styles.presetChipText, budgetLimit === preset && styles.presetChipTextSelected]}>
                  ₹{preset >= 100000 ? `${preset/100000}L` : `${preset/1000}k`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* SECTION 2: NEW EXPENSE INPUT FORM FIELDS */}
          <Text style={styles.headerTitle}>New Expense</Text>
          
          <Text style={styles.label}>What did you buy?</Text>
          <TextInput style={styles.input} placeholder="e.g. Chai & Samosa" value={title} onChangeText={setTitle} placeholderTextColor="#aaa"/>

          <Text style={styles.label}>How much? ({currency})</Text>
          <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={amount} onChangeText={setAmount} placeholderTextColor="#aaa"/>

          <Text style={styles.label}>Category Selection</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} activeOpacity={0.7} style={[styles.categoryBtn, category === cat && styles.selectedBtn]} onPress={() => setCategory(cat)}>
                <Text style={[styles.categoryText, category === cat && styles.selectedText]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* New Feature: Payment Method Selection */}
          <Text style={styles.label}>Paid Using</Text>
          <View style={styles.methodGrid}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity key={method} style={[styles.methodBtn, paymentMethod === method && styles.methodBtnSelected]} onPress={() => setPaymentMethod(method)}>
                <Text style={[styles.methodText, paymentMethod === method && styles.methodTextSelected]}>
                  {method === 'UPI' ? '📱 UPI' : method === 'Cash' ? '💵 Cash' : '💳 Card'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SAVE ACTION BUTTON AT THE BOTTOM */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Transaction</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#444', marginTop: 15 },
  label: { fontSize: 15, color: '#666', marginBottom: 8, marginTop: 15, fontWeight: '500' },
  input: { backgroundColor: '#f9f9f9', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#eee', color: '#333' },
  presetGrid: { flexDirection: 'row', gap: 8, marginTop: 10 },
  presetChip: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  presetChipSelected: { backgroundColor: '#10b981', borderColor: '#10b981' },
  presetChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  presetChipTextSelected: { color: '#fff' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  categoryBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#eee' },
  selectedBtn: { backgroundColor: '#2f95dc', borderColor: '#2f95dc' },
  categoryText: { color: '#333', fontWeight: '500' },
  selectedText: { color: '#fff' },
  methodGrid: { flexDirection: 'row', gap: 10, marginTop: 5 },
  methodBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  methodBtnSelected: { backgroundColor: '#2f95dc', borderColor: '#2f95dc' },
  methodText: { fontWeight: '600', color: '#444' },
  methodTextSelected: { color: '#fff' },
  saveButton: { backgroundColor: '#2f95dc', padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 25 },
});