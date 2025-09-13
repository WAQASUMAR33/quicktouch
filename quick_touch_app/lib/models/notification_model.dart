import 'package:cloud_firestore/cloud_firestore.dart';

enum NotificationType {
  eventReminder,
  milestone,
  scoutContact,
  adminMessage,
  messageReceived,
  newEvaluation,
  trainingReminder,
  matchReminder,
}

class NotificationModel {
  final String id;
  final String userId;
  final NotificationType type;
  final String title;
  final String message;
  final String? relatedId; // Reference to related entity
  final bool isRead;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.message,
    this.relatedId,
    required this.isRead,
    required this.createdAt,
  });

  factory NotificationModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return NotificationModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      type: NotificationType.values.firstWhere(
        (type) => type.name == data['type'],
        orElse: () => NotificationType.adminMessage,
      ),
      title: data['title'] ?? '',
      message: data['message'] ?? '',
      relatedId: data['relatedId'],
      isRead: data['isRead'] ?? false,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'type': type.name,
      'title': title,
      'message': message,
      'relatedId': relatedId,
      'isRead': isRead,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  // Get notification type icon
  String get typeIcon {
    switch (type) {
      case NotificationType.eventReminder:
        return '📅';
      case NotificationType.milestone:
        return '🏆';
      case NotificationType.scoutContact:
        return '👁️';
      case NotificationType.adminMessage:
        return '📢';
      case NotificationType.messageReceived:
        return '💬';
      case NotificationType.newEvaluation:
        return '📊';
      case NotificationType.trainingReminder:
        return '🏃‍♂️';
      case NotificationType.matchReminder:
        return '⚽';
    }
  }

  // Get notification type color
  String get typeColor {
    switch (type) {
      case NotificationType.eventReminder:
        return '#3498DB'; // Blue
      case NotificationType.milestone:
        return '#F39C12'; // Orange
      case NotificationType.scoutContact:
        return '#9B59B6'; // Purple
      case NotificationType.adminMessage:
        return '#E74C3C'; // Red
      case NotificationType.messageReceived:
        return '#2ECC71'; // Green
      case NotificationType.newEvaluation:
        return '#1ABC9C'; // Teal
      case NotificationType.trainingReminder:
        return '#E67E22'; // Orange
      case NotificationType.matchReminder:
        return '#27AE60'; // Green
    }
  }

  // Check if notification is recent (within last 24 hours)
  bool get isRecent {
    final now = DateTime.now();
    final difference = now.difference(createdAt).inHours;
    return difference <= 24;
  }

  NotificationModel copyWith({
    String? id,
    String? userId,
    NotificationType? type,
    String? title,
    String? message,
    String? relatedId,
    bool? isRead,
    DateTime? createdAt,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      title: title ?? this.title,
      message: message ?? this.message,
      relatedId: relatedId ?? this.relatedId,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
