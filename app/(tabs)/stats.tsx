import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useExpenses } from '../../context/ExpenseContext';

const MONTH_FILTERS = ['All', 'This Month', 'Other Logs'];

export default function StatsScreen() {
  const { expenses, currency } = useExpenses();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = expenses.filter(item => {
    if (activeFilter === 'All') return true;
    const [itemMonth] = item.date.split('/');
    const currentMonth = (new Date().getMonth() + 1).toString();
    if (activeFilter === 'This Month') return itemMonth === currentMonth || item.date.includes(`${currentMonth}/`);
    return itemMonth !== currentMonth && !item.date.includes(`${currentMonth}/`);
  });

  const total = filteredData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Category Crunching Logic Matrices
  const categoryTotals: { [key: string]: number } = {};
  // Payment Mode Crunching Logic Matrices
  const methodTotals: { [key: string]: number } = { 'UPI': 0, 'Cash': 0, 'Card': 0 };

  filteredData.forEach(item => {
    const amountVal = parseFloat(item.amount) || 0;
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amountVal;
    
    const methodKey = item.paymentMethod || 'UPI';
    methodTotals[methodKey] = (methodTotals[methodKey] || 0) + amountVal;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Track structural asset distribution allocations</Text>

        <View style={styles.filterContainer}>
          {MONTH_FILTERS.map(filter => (
            <TouchableOpacity key={filter} style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]} onPress={() => setActiveFilter(filter)}>
              <Text style={[styles.filterTabText, activeFilter === filter && styles.activeFilterTabText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.overallCard}>
          <Text style={styles.cardLabel}>Selected Pipeline Volume ({activeFilter})</Text>
          <Text style={styles.cardValue}>{currency}{total.toFixed(2)}</Text>
        </View>

        {/* PAYMENT WALLET DISTRIBUTION METRICS */}
        <Text style={styles.sectionTitle}>Payment Method Distribution</Text>
        <View style={styles.methodSummaryCard}>
          {Object.keys(methodTotals).map(method => {
            const methodAmount = methodTotals[method];
            const percentage = total > 0 ? (methodAmount / total) * 100 : 0;
            return (
              <View key={method} style={styles.methodRow}>
                <Text style={styles.methodName}>
                  {method === 'UPI' ? '📱 UPI' : method === 'Cash' ? '💵 Cash' : '💳 Card'}
                </Text>
                <Text style={styles.methodValue}>
                  {currency}{methodAmount.toFixed(0)} ({percentage.toFixed(0)}%)
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Category Breakdowns</Text>
        {Object.keys(categoryTotals).length === 0 ? (
          <Text style={styles.emptyText}>No contextual line transactions found for this segment.</Text>
        ) : (
          Object.keys(categoryTotals).map(cat => {
            const catAmount = categoryTotals[cat];
            const percentage = total > 0 ? (catAmount / total) * 100 : 0;

            return (
              <View key={cat} style={styles.statRow}>
                <View style={styles.rowInfo}>
                  <Text style={styles.categoryName}>{cat}</Text>
                  <Text style={styles.categoryValue}>{currency}{catAmount.toFixed(2)} ({percentage.toFixed(1)}%)</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#777', marginBottom: 15, marginTop: 4 },
  filterContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f3f5', alignItems: 'center' },
  activeFilterTab: { backgroundColor: '#2f95dc' },
  filterTabText: { color: '#495057', fontWeight: '600', fontSize: 13 },
  activeFilterTabText: { color: '#fff' },
  overallCard: { backgroundColor: '#10b981', padding: 20, borderRadius: 15, marginBottom: 20 },
  cardLabel: { color: '#fff', opacity: 0.9, fontSize: 14, fontWeight: '500' },
  cardValue: { color: '#fff', fontSize: 30, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#444', marginBottom: 12, marginTop: 10 },
  
  // FIX APPLIED HERE: Changed 'borderVertical: 1' to 'borderWidth: 1'
  methodSummaryCard: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginBottom: 20 },
  
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  methodName: { fontSize: 15, fontWeight: '500', color: '#444' },
  methodValue: { fontSize: 15, fontWeight: '600', color: '#2f95dc' },
  statRow: { marginBottom: 18 },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryName: { fontSize: 16, fontWeight: '500', color: '#333' },
  categoryValue: { fontSize: 14, fontWeight: '600', color: '#666' },
  progressBarBackground: { height: 10, backgroundColor: '#f0f0f0', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2f95dc', borderRadius: 5 },
  emptyText: { color: '#aaa', fontSize: 14, marginTop: 15, textAlign: 'center' }
});