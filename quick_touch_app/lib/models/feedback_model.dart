import 'package:cloud_firestore/cloud_firestore.dart';

class FeedbackModel {
  final String id;
  final String playerId;
  final String coachId;
  final int rating; // 1-5 scale
  final String notes;
  final DateTime date;
  final DateTime createdAt;

  FeedbackModel({
    required this.id,
    required this.playerId,
    required this.coachId,
    required this.rating,
    required this.notes,
    required this.date,
    required this.createdAt,
  });

  factory FeedbackModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return FeedbackModel(
      id: doc.id,
      playerId: data['playerId'] ?? '',
      coachId: data['coachId'] ?? '',
      rating: data['rating'] ?? 0,
      notes: data['notes'] ?? '',
      date: (data['date'] as Timestamp).toDate(),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'playerId': playerId,
      'coachId': coachId,
      'rating': rating,
      'notes': notes,
      'date': Timestamp.fromDate(date),
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  // Get rating description
  String get ratingDescription {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Below Average';
      case 3:
        return 'Average';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return 'Not Rated';
    }
  }

  // Get rating color
  String get ratingColor {
    switch (rating) {
      case 1:
        return '#E74C3C'; // Red
      case 2:
        return '#E67E22'; // Orange
      case 3:
        return '#F39C12'; // Yellow
      case 4:
        return '#2ECC71'; // Green
      case 5:
        return '#27AE60'; // Dark Green
      default:
        return '#95A5A6'; // Gray
    }
  }
}
