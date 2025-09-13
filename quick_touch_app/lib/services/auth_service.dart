import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  
  UserModel? _currentUser;
  UserModel? get currentUser => _currentUser;

  // Initialize user data when app starts
  Future<void> initializeUser() async {
    await _apiService.loadAuthToken();
    if (_apiService.isAuthenticated) {
      await _loadUserData();
    }
  }

  // Load user data from API
  Future<void> _loadUserData() async {
    try {
      final userData = await _apiService.getCurrentUser();
      _currentUser = UserModel.fromApiResponse(userData);
    } catch (e) {
      print('Error loading user data: $e');
      _currentUser = null;
    }
  }

  // Sign up with email and password
  Future<UserModel?> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required UserRole role,
    String? phone,
  }) async {
    try {
      final response = await _apiService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role.name,
        phone: phone,
      );

      if (response['user'] != null) {
        _currentUser = UserModel.fromApiResponse(response['user']);
        return _currentUser;
      }
    } catch (e) {
      print('Sign up error: $e');
      rethrow;
    }
    return null;
  }

  // Sign in with email and password
  Future<UserModel?> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.login(
        email: email,
        password: password,
      );

      if (response['user'] != null) {
        _currentUser = UserModel.fromApiResponse(response['user']);
        return _currentUser;
      }
    } catch (e) {
      print('Sign in error: $e');
      rethrow;
    }
    return null;
  }

  // Sign out
  Future<void> signOut() async {
    await _apiService.logout();
    _currentUser = null;
  }

  // Reset password
  Future<void> resetPassword(String email) async {
    try {
      await _apiService.resetPassword(email);
    } catch (e) {
      print('Password reset error: $e');
      rethrow;
    }
  }

  // Update user profile
  Future<void> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
    String? profileImageUrl,
  }) async {
    if (_currentUser == null) return;

    try {
      final updateData = <String, dynamic>{};
      if (firstName != null) updateData['firstName'] = firstName;
      if (lastName != null) updateData['lastName'] = lastName;
      if (phone != null) updateData['phone'] = phone;
      if (profileImageUrl != null) updateData['profileImageUrl'] = profileImageUrl;

      final response = await _apiService.updateProfile(updateData);
      _currentUser = UserModel.fromApiResponse(response);
    } catch (e) {
      print('Update profile error: $e');
      rethrow;
    }
  }

  // Check if user has specific role
  bool hasRole(UserRole role) {
    return _currentUser?.role == role;
  }

  // Check if user is admin
  bool get isAdmin => hasRole(UserRole.admin);

  // Check if user is coach
  bool get isCoach => hasRole(UserRole.coach);

  // Check if user is scout
  bool get isScout => hasRole(UserRole.scout);

  // Check if user is player
  bool get isPlayer => hasRole(UserRole.player);

  // Check if user is parent
  bool get isParent => hasRole(UserRole.parent);
}

// Provider for AuthService
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

// Provider for current user
final currentUserProvider = StateProvider<UserModel?>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.currentUser;
});
