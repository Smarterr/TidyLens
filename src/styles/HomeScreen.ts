// src/screens/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Enforcing a clean off-white background
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // Enforcing dark text so it doesn't vanish
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: '#111' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  filterContainer: { borderBottomWidth: 1, borderColor: '#EBEBEB', paddingBottom: 5 },
  
  // Upgraded Permission Screen UI
  permissionTitle: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 10, textAlign: 'center' },
  permissionSubtext: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20, lineHeight: 22 },
  
  loadingText: { marginTop: 10, color: '#666', fontWeight: '500' },
  
  // Sleek, Apple-style pill button
  button: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 14, 
    paddingHorizontal: 32, 
    borderRadius: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  
  deleteButton: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  deleteButtonText: { color: 'white', fontWeight: '700', fontSize: 14 },

  // --- ADD THESE TO THE BOTTOM OF HomeStyles.ts ---
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  settingsButton: { padding: 5 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20, color: '#111' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  settingTextContainer: { flex: 1, paddingRight: 15 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  settingDescription: { fontSize: 13, color: '#666', marginTop: 4 },
  closeButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
});