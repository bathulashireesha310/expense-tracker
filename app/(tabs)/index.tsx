import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useExpenses, Expense } from '../../context/ExpenseContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { expenses, deleteExpense, currency, budgetLimit, clearAllData } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');

  const total = expenses ? expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) : 0;
  
  const overBudget = total > budgetLimit;
  const nearBudget = total >= budgetLimit * 0.8 && total <= budgetLimit;

  const getCardStyle = () => {
    if (overBudget) return styles.cardRed;
    if (nearBudget) return styles.cardOrange;
    return styles.cardBlue;
  };

  const filteredExpenses = expenses.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.paymentMethod && item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const triggerResetAll = () => {
    Alert.alert(
      "Flush Workspace?",
      "Are you sure you want to completely erase your data footprint history logs permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Wipe Everything", style: "destructive", onPress: () => clearAllData() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topActionRow}>
          <Text style={styles.title}>My Budget</Text>
          <TouchableOpacity onPress={triggerResetAll} style={styles.wipeBtn}>
            <Ionicons name="refresh-circle-outline" size={28} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        <View style={[styles.cardBase, getCardStyle()]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.label}>Total Spent</Text>
            <Text style={styles.budgetCapLabel}>Cap: {currency}{budgetLimit.toFixed(0)}</Text>
          </View>
          <Text style={styles.totalAmount}>{currency}{total.toFixed(2)}</Text>
          
          {nearBudget && (
            <View style={styles.warningBadge}>
              <Ionicons name="alert-circle" size={16} color="#fff" />
              <Text style={styles.warningText}>Approaching Budget Cap! (Over 80%)</Text>
            </View>
          )}

          {overBudget && (
            <View style={styles.warningBadge}>
              <Ionicons name="warning" size={16} color="#fff" />
              <Text style={styles.warningText}>Overspending Limit Breach detected!</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search items, categories, UPI, Cash..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item: Expense) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }: { item: Expense }) => (
          <View style={styles.itemRow}>
            <View style={styles.leftContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemCategory}>
                {item.category} • {item.date}
              </Text>
              {/* Payment Method Badge indicator */}
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>
                  {item.paymentMethod === 'UPI' ? '📱 UPI' : item.paymentMethod === 'Cash' ? '💵 Cash' : '💳 Card'}
                </Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.itemAmount}>-{currency}{parseFloat(item.amount).toFixed(2)}</Text>
              <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No matching transaction lines registered.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#f8f9fa' },
  topActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  wipeBtn: { padding: 4 },
  cardBase: { padding: 20, borderRadius: 15 },
  cardBlue: { backgroundColor: '#2f95dc' },
  cardOrange: { backgroundColor: '#f39c12' },
  cardRed: { backgroundColor: '#d9534f' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#fff', opacity: 0.8, fontSize: 16 },
  budgetCapLabel: { color: '#fff', fontSize: 14, fontWeight: '600', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  totalAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  warningBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: 'rgba(0,0,0,0.15)', padding: 8, borderRadius: 8 },
  warningText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f5', marginHorizontal: 20, marginVertical: 12, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e9ecef' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: '#333' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#eee' },
  leftContainer: { flex: 1 },
  rightContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  itemCategory: { color: '#777', fontSize: 13, marginTop: 2 },
  methodBadge: { backgroundColor: '#f0f3f6', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginTop: 5 },
  methodBadgeText: { fontSize: 11, fontWeight: '600', color: '#555' },
  itemAmount: { fontSize: 18, fontWeight: 'bold', color: '#e74c3c' },
  deleteBtn: { padding: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 8 },
  emptyText: { color: '#999', fontSize: 15 }
});