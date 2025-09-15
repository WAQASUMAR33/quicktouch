class AppConstants {
  // API Configuration
  static const String baseUrl = 'https://quicktouch.vercel.app/api';
  static const String adminPanelUrl = 'https://quicktouch.vercel.app';
  
  // Firebase Collections
  static const String usersCollection = 'users';
  static const String playersCollection = 'players';
  static const String coachesCollection = 'coaches';
  static const String scoutsCollection = 'scouts';
  static const String parentsCollection = 'parents';
  static const String eventsCollection = 'events';
  static const String notificationsCollection = 'notifications';
  static const String evaluationsCollection = 'evaluations';
  static const String attendanceCollection = 'attendance';
  
  // User Roles
  static const String playerRole = 'player';
  static const String coachRole = 'coach';
  static const String scoutRole = 'scout';
  static const String parentRole = 'parent';
  static const String adminRole = 'admin';
  
  // Storage Paths
  static const String profileImagesPath = 'profile_images';
  static const String highlightVideosPath = 'highlight_videos';
  static const String trainingVideosPath = 'training_videos';
  static const String documentsPath = 'documents';
  
  // App Settings
  static const int maxVideoSizeMB = 100;
  static const int maxImageSizeMB = 10;
  static const List<String> allowedVideoFormats = ['mp4', 'mov', 'avi'];
  static const List<String> allowedImageFormats = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Notification Types
  static const String matchReminder = 'match_reminder';
  static const String trainingReminder = 'training_reminder';
  static const String milestoneAchieved = 'milestone_achieved';
  static const String newEvaluation = 'new_evaluation';
  static const String messageReceived = 'message_received';
  static const String eventUpdate = 'event_update';
}
