import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Task({
  taskData,
  onToggleComplete,
  onDelete,
  onEdit,
}: {
  taskData: any;
  onToggleComplete: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={onToggleComplete} style={styles.titleContainer}>
          <Text style={[styles.taskName, taskData.completed && styles.completed]}>
            {taskData.taskName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      {expanded && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>Related To: {taskData.taskRelated}</Text>
          <Text style={styles.detail}>Level: {taskData.taskLevel}</Text>
          <Text style={styles.detail}>Allocated Time: {taskData.taskAllocatedTime}</Text>
          <Text style={styles.detail}>Scheduled Time: {taskData.taskScheduledTime}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: '#ccc',
    backgroundColor: 'white',
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'green',
    borderRadius:12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  titleContainer: {
    flex: 1,
  },
  arrowButton: {
    paddingLeft: 10,
  },
  arrowText: {
    fontSize: 18,
    color: 'white',
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  detailsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ffcccc',
    padding: 8,
    borderRadius: 5,
  },
});
