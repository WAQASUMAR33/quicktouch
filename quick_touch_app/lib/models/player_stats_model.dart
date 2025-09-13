import 'package:cloud_firestore/cloud_firestore.dart';

class PlayerStatsModel {
  final String id;
  final String playerId;
  final String matchId;
  final int goals;
  final int assists;
  final int minutesPlayed;
  final DateTime date;
  final DateTime createdAt;

  PlayerStatsModel({
    required this.id,
    required this.playerId,
    required this.matchId,
    required this.goals,
    required this.assists,
    required this.minutesPlayed,
    required this.date,
    required this.createdAt,
  });

  factory PlayerStatsModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PlayerStatsModel(
      id: doc.id,
      playerId: data['playerId'] ?? '',
      matchId: data['matchId'] ?? '',
      goals: data['goals'] ?? 0,
      assists: data['assists'] ?? 0,
      minutesPlayed: data['minutesPlayed'] ?? 0,
      date: (data['date'] as Timestamp).toDate(),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'playerId': playerId,
      'matchId': matchId,
      'goals': goals,
      'assists': assists,
      'minutesPlayed': minutesPlayed,
      'date': Timestamp.fromDate(date),
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  // Calculate total goals across all matches
  static int getTotalGoals(List<PlayerStatsModel> stats) {
    return stats.fold(0, (sum, stat) => sum + stat.goals);
  }

  // Calculate total assists across all matches
  static int getTotalAssists(List<PlayerStatsModel> stats) {
    return stats.fold(0, (sum, stat) => sum + stat.assists);
  }

  // Calculate total minutes played
  static int getTotalMinutes(List<PlayerStatsModel> stats) {
    return stats.fold(0, (sum, stat) => sum + stat.minutesPlayed);
  }

  // Calculate goals per match average
  static double getGoalsPerMatch(List<PlayerStatsModel> stats) {
    if (stats.isEmpty) return 0.0;
    return getTotalGoals(stats) / stats.length;
  }

  // Calculate assists per match average
  static double getAssistsPerMatch(List<PlayerStatsModel> stats) {
    if (stats.isEmpty) return 0.0;
    return getTotalAssists(stats) / stats.length;
  }
}
