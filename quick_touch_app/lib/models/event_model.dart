enum EventType {
  training,
  match,
  trial,
  showcase,
  guestSession,
}

class EventModel {
  final String id;
  final String academyId;
  final String title;
  final String description;
  final DateTime date;
  final String location;
  final EventType type;
  final DateTime createdAt;

  EventModel({
    required this.id,
    required this.academyId,
    required this.title,
    required this.description,
    required this.date,
    required this.location,
    required this.type,
    required this.createdAt,
  });

  factory EventModel.fromApiResponse(Map<String, dynamic> data) {
    return EventModel(
      id: data['id'] ?? '',
      academyId: data['academyId'] ?? '',
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      date: DateTime.parse(data['date'] ?? DateTime.now().toIso8601String()),
      location: data['location'] ?? '',
      type: EventType.values.firstWhere(
        (type) => type.name == data['type'],
        orElse: () => EventType.training,
      ),
      createdAt: DateTime.parse(data['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toApiRequest() {
    return {
      'academyId': academyId,
      'title': title,
      'description': description,
      'date': date.toIso8601String(),
      'location': location,
      'type': type.name,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // Get event type display name
  String get typeDisplayName {
    switch (type) {
      case EventType.training:
        return 'Training Session';
      case EventType.match:
        return 'Match';
      case EventType.trial:
        return 'Trial';
      case EventType.showcase:
        return 'Showcase';
      case EventType.guestSession:
        return 'Guest Session';
    }
  }

  // Get event type icon
  String get typeIcon {
    switch (type) {
      case EventType.training:
        return '🏃‍♂️';
      case EventType.match:
        return '⚽';
      case EventType.trial:
        return '🎯';
      case EventType.showcase:
        return '⭐';
      case EventType.guestSession:
        return '👥';
    }
  }

  // Check if event is today
  bool get isToday {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  // Check if event is upcoming (within next 7 days)
  bool get isUpcoming {
    final now = DateTime.now();
    final difference = date.difference(now).inDays;
    return difference >= 0 && difference <= 7;
  }
}
