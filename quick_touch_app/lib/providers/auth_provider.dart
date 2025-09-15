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
final authStateProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((ref) {
  return AuthNotifier();
});

// Auth notifier
class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  AuthNotifier() : super(const AsyncValue.loading()) {
    _initializeAuth();
  }

  final ApiService _apiService = ApiService();

  Future<void> _initializeAuth() async {
    try {
      await _apiService.loadToken();
      if (_apiService.isAuthenticated) {
        // Fetch user data from stored token
        final userData = await _apiService.getCurrentUser();
        if (userData != null) {
          final user = User.fromJson(userData);
          state = AsyncValue.data(user);
        } else {
          state = const AsyncValue.data(null);
        }
      } else {
        state = const AsyncValue.data(null);
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> login(String email, String password) async {
    try {
      state = const AsyncValue.loading();
      
      final response = await _apiService.login(email, password);
      
      // Create user object from response
      final user = User.fromJson(response['user']);
      
      state = AsyncValue.data(user);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> register(Map<String, dynamic> userData) async {
    try {
      state = const AsyncValue.loading();
      
      final response = await _apiService.register(userData);
      
      // Create user object from response
      final user = User.fromJson(response['user']);
      
      state = AsyncValue.data(user);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
      state = const AsyncValue.data(null);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  void clearError() {
    if (state.hasError) {
      state = const AsyncValue.data(null);
    }
  }
}

// User provider for easy access to current user
final currentUserProvider = Provider<User?>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.when(
    data: (user) => user,
    loading: () => null,
    error: (_, __) => null,
  );
});

// Authentication status provider
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authStateProvider);
  return authState.when(
    data: (user) => user != null,
    loading: () => false,
    error: (_, __) => false,
  );
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


