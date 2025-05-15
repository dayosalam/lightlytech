import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { GestureHandlerRootView, PanGestureHandler, Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import { useAuth } from '@/context/AuthContext'
import { updateUserDetails } from '@/api/profile'

interface MoodModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MoodItem {
  id: string;
  name: string;
  icon: string;
}

const { width } = Dimensions.get('window');

const MoodModal = ({ visible, onClose }: MoodModalProps) => {
  // Use auth context to get and update user details
  const { user, updateUser } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | undefined>(user?.mood);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sample mood items
  const moodItems: MoodItem[] = [
    { id: '1', name: 'Light saving', icon: '🧩' },
    { id: '2', name: 'Out to work', icon: '🏢' },
    // Add more mood options as needed
  ];

  // Handle selecting a mood
  const handleSelectMood = async (mood: MoodItem) => {
    try {
      setIsUpdating(true);
      setSelectedMood(mood.id);

      // Update user mood in backend and context
      await updateUserDetails({ mood: mood.id });
      await updateUser({ mood: mood.id });

      Alert.alert('Success', `Mood set to ${mood.name}`);
    } catch (error) {
      console.error('Error updating mood:', error);
      Alert.alert('Error', 'Failed to update mood');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Ionicons name="close" size={24} color="#878787" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Set mood</Text>
          
          {isUpdating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#022322" />
            </View>
          ) : (
            <GestureHandlerRootView style={{ flex: 1 }}>
              {moodItems.map((item) => (
                <SwipeableItem 
                  key={item.id} 
                  item={item} 
                  isSelected={selectedMood === item.id}
                  onSelect={() => handleSelectMood(item)}
                  onEdit={() => handleSelectMood(item)}
                />
              ))}
            </GestureHandlerRootView>
          )}
        </View>
      </View>
    </Modal>
  )
}

// Swipeable mood item component
interface SwipeableItemProps {
  item: MoodItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
}

const SwipeableItem = ({ item, isSelected, onSelect, onEdit }: SwipeableItemProps) => {
  const translateX = useSharedValue(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Calculate how much to drag to reveal the edit button
  const editButtonWidth = 80;
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Limit dragging to left direction only and not beyond edit button width
      translateX.value = Math.min(0, Math.max(-editButtonWidth, event.translationX));
    })
    .onEnd(() => {
      // Snap to either closed or open position
      if (translateX.value < -editButtonWidth / 2) {
        translateX.value = withTiming(-editButtonWidth);
        runOnJS(setIsEditing)(true);
      } else {
        translateX.value = withTiming(0);
        runOnJS(setIsEditing)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  
  const handleEdit = () => {
    if (onEdit) {
      // Call the edit handler provided by parent
      onEdit();
      // Reset position after editing
      resetPosition();
    }
  };
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };
  
  const resetPosition = () => {
    translateX.value = withTiming(0);
    setIsEditing(false);
  };

  return (
    <View style={styles.itemContainer}>
      {/* Edit button behind the item */}
      <View style={styles.editContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleEdit}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      
      {/* Swipeable content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.itemContent, animatedStyle, isSelected && styles.selectedItem]}>
          <TouchableOpacity 
            style={styles.selectableContent} 
            onPress={handleSelect}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.itemText}>{item.name}</Text>
            
            {isSelected && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#022322" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MoodModal

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 25,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    marginBottom: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 24,
    borderRadius: 100,
    borderColor: "#878787",
    borderWidth: 1,
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  itemContainer: {
    width: '100%',
    height: 60,
    marginBottom: 15,
    // borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  editContainer: {
    position: 'absolute',
    right: 8,
    height: '100%',
    width: 80,
    backgroundColor: '#022322',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  editText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'InterRegular',
    marginTop: 2,
  },
  itemContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // borderRadius: 12,
  },
  selectedItem: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 3,
    borderLeftColor: '#022322',
  },
  selectableContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#022322',
    flex: 1,
  },
  checkmarkContainer: {
    marginLeft: 'auto',
    paddingRight: 8,
  },
})