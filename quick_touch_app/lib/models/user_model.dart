class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String role;
  final String? phone;
  final String? profileImage;
  final String? academyId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;
  final Map<String, dynamic>? preferences;

  const User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.phone,
    this.profileImage,
    this.academyId,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
    this.preferences,
  });

  String get fullName => '$firstName $lastName';
  String get displayName => fullName;
  String get initials => '${firstName[0]}${lastName[0]}'.toUpperCase();

  bool get isPlayer => role.toLowerCase() == 'player';
  bool get isCoach => role.toLowerCase() == 'coach';
  bool get isAdmin => role.toLowerCase() == 'admin';
  bool get isScout => role.toLowerCase() == 'scout';
  bool get isParent => role.toLowerCase() == 'parent';

  factory User.fromJson(Map<String, dynamic> json) {
    // Handle both fullName and firstName/lastName formats
    String firstName, lastName;
    if (json['fullName'] != null) {
      final nameParts = (json['fullName'] as String).split(' ');
      firstName = nameParts.isNotEmpty ? nameParts[0] : '';
      lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';
    } else {
      firstName = json['firstName'] as String? ?? '';
      lastName = json['lastName'] as String? ?? '';
    }

    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: firstName,
      lastName: lastName,
      role: json['role'] as String,
      phone: json['phone'] as String?,
      profileImage: json['profileImage'] as String?,
      academyId: json['academyId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      preferences: json['preferences'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'phone': phone,
      'profileImage': profileImage,
      'academyId': academyId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'isActive': isActive,
      'preferences': preferences,
    };
  }

  User copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? role,
    String? phone,
    String? profileImage,
    String? academyId,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isActive,
    Map<String, dynamic>? preferences,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      role: role ?? this.role,
      phone: phone ?? this.phone,
      profileImage: profileImage ?? this.profileImage,
      academyId: academyId ?? this.academyId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isActive: isActive ?? this.isActive,
      preferences: preferences ?? this.preferences,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User(id: $id, email: $email, fullName: $fullName, role: $role)';
  }
}

// Player model extends User
class Player extends User {
  final String? position;
  final int? age;
  final String? dateOfBirth;
  final String? height;
  final String? weight;
  final String? preferredFoot;
  final String? jerseyNumber;
  final String? teamId;
  final Map<String, dynamic>? stats;
  final List<String>? skills;
  final String? parentId;

  const Player({
    required super.id,
    required super.email,
    required super.firstName,
    required super.lastName,
    required super.role,
    super.phone,
    super.profileImage,
    super.academyId,
    required super.createdAt,
    required super.updatedAt,
    super.isActive = true,
    super.preferences,
    this.position,
    this.age,
    this.dateOfBirth,
    this.height,
    this.weight,
    this.preferredFoot,
    this.jerseyNumber,
    this.teamId,
    this.stats,
    this.skills,
    this.parentId,
  });

  factory Player.fromJson(Map<String, dynamic> json) {
    return Player(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      role: json['role'] as String,
      phone: json['phone'] as String?,
      profileImage: json['profileImage'] as String?,
      academyId: json['academyId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      preferences: json['preferences'] as Map<String, dynamic>?,
      position: json['position'] as String?,
      age: json['age'] as int?,
      dateOfBirth: json['dateOfBirth'] as String?,
      height: json['height'] as String?,
      weight: json['weight'] as String?,
      preferredFoot: json['preferredFoot'] as String?,
      jerseyNumber: json['jerseyNumber'] as String?,
      teamId: json['teamId'] as String?,
      stats: json['stats'] as Map<String, dynamic>?,
      skills: (json['skills'] as List<dynamic>?)?.cast<String>(),
      parentId: json['parentId'] as String?,
    );
  }

  @override
  Map<String, dynamic> toJson() {
    final json = super.toJson();
    json.addAll({
      'position': position,
      'age': age,
      'dateOfBirth': dateOfBirth,
      'height': height,
      'weight': weight,
      'preferredFoot': preferredFoot,
      'jerseyNumber': jerseyNumber,
      'teamId': teamId,
      'stats': stats,
      'skills': skills,
      'parentId': parentId,
    });
    return json;
  }
}