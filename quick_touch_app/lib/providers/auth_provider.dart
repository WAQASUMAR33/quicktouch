import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

// Auth state model
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }

  bool get isAuthenticated => user != null;
}

// Auth state provider
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState()) {
    _initializeAuth();
  }

  final ApiService _apiService = ApiService();

  Future<void> _initializeAuth() async {
    try {
      state = state.copyWith(isLoading: true);
      await _apiService.loadToken();
      if (_apiService.isAuthenticated) {
        // Fetch user data from stored token
        final userData = await _apiService.getCurrentUser();
        if (userData != null) {
          final user = User.fromJson(userData);
          state = state.copyWith(user: user, isLoading: false);
        } else {
          state = state.copyWith(user: null, isLoading: false);
        }
      } else {
        state = state.copyWith(user: null, isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final response = await _apiService.login(email, password);
      
      // Create user object from response
      final user = User.fromJson(response['user']);
      
      state = state.copyWith(user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      // Initialize API service if needed
      _apiService.initialize();
      
      final response = await _apiService.register(userData);
      
      // Check if registration was successful
      if (response['success'] == true && response['user'] != null) {
        // Create user object from response
        final user = User.fromJson(response['user']);
        
        state = state.copyWith(user: user, isLoading: false);
        return true;
      } else {
        // Handle case where user creation succeeded but no user data returned
        state = state.copyWith(
          error: response['message'] ?? 'Registration successful but user data not available',
          isLoading: false
        );
        return false;
      }
    } catch (e) {
      print('Registration error: $e');
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
      state = const AuthState();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

// User provider for easy access to current user
final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.user;
});

// Authentication status provider
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.isAuthenticated;
});

// User role provider
final userRoleProvider = Provider<String?>((ref) {
  final user = ref.watch(currentUserProvider);
  return user?.role;
});

// Role-based access providers
final isPlayerProvider = Provider<bool>((ref) {
  final role = ref.watch(userRoleProvider);
  return role == 'player';
});

final isCoachProvider = Provider<bool>((ref) {
  final role = ref.watch(userRoleProvider);
  return role == 'coach';
});

final isAdminProvider = Provider<bool>((ref) {
  final role = ref.watch(userRoleProvider);
  return role == 'admin';
});

final isScoutProvider = Provider<bool>((ref) {
  final role = ref.watch(userRoleProvider);
  return role == 'scout';
});

final isParentProvider = Provider<bool>((ref) {
  final role = ref.watch(userRoleProvider);
  return role == 'parent';
});


