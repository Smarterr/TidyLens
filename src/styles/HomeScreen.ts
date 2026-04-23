import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // --- Core Layout ---
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // iOS System Background Gray
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // --- Header Styling ---
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#F2F2F7',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1, // Gives it that tight, premium Apple look
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Dashboard Styling ---
  dashboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8, // For Android shadow
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 5,
  },
  heroValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryTextContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  categorySubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  categorySize: {
    fontSize: 17,
    fontWeight: '700',
    color: '#007AFF',
    marginRight: 8,
  },

  // --- Filter Container & List Status ---
  filterContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    zIndex: 10, 
  },
  selectAllText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
    paddingTop: 10,
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 5,
  },

  // --- Floating Action Button (Delete) ---
  floatingDeleteContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    zIndex: 100, // Floats above everything
  },
  deleteButton: {
    backgroundColor: '#FF3B30', // Apple System Red
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
  },

  // --- Modern Settings Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // --- Permissions Screen ---
  permissionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  }
});