import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  filterContainer: { borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 5 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  loadingText: { marginTop: 10, color: 'gray', fontWeight: '500' }, // Capital T
  button: { backgroundColor: '#000', padding: 15, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '700' },
  deleteButton: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  deleteButtonText: { color: 'white', fontWeight: '700', fontSize: 14 },
});