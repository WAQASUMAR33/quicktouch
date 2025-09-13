import 'package:cloud_firestore/cloud_firestore.dart';

class PlayerModel {
  final String id;
  final String userId;
  final String fullName;
  final int age;
  final double height; // In meters
  final String position;
  final List<String> highlightReels; // URLs to highlight videos
  final String academyId;
  final DateTime createdAt;
  final DateTime updatedAt;

  PlayerModel({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.age,
    required this.height,
    required this.position,
    required this.highlightReels,
    required this.academyId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory PlayerModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PlayerModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      fullName: data['fullName'] ?? '',
      age: data['age'] ?? 0,
      height: (data['height'] ?? 0.0).toDouble(),
      position: data['position'] ?? '',
      highlightReels: List<String>.from(data['highlightReels'] ?? []),
      academyId: data['academyId'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'fullName': fullName,
      'age': age,
      'height': height,
      'position': position,
      'highlightReels': highlightReels,
      'academyId': academyId,
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  PlayerModel copyWith({
    String? id,
    String? userId,
    String? fullName,
    int? age,
    double? height,
    String? position,
    List<String>? highlightReels,
    String? academyId,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return PlayerModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      fullName: fullName ?? this.fullName,
      age: age ?? this.age,
      height: height ?? this.height,
      position: position ?? this.position,
      highlightReels: highlightReels ?? this.highlightReels,
      academyId: academyId ?? this.academyId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
