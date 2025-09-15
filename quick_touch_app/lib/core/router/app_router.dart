import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_provider.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/dashboard/dashboard_screen.dart';
import '../../screens/messaging/messaging_screen.dart';
import '../../screens/player_comparison/player_comparison_screen.dart';
import '../../screens/ai_insights/ai_insights_screen.dart';
import '../../screens/advanced_stats/advanced_stats_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/splash/splash_screen.dart';
import '../../screens/test/academy_test_screen.dart';

// Router configuration
final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final authState = ref.read(authStateProvider);
      final isAuthenticated = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      final isSplashRoute = state.matchedLocation == '/splash';

      // Allow splash screen to load first
      if (isSplashRoute) {
        return null;
      }

      // If not authenticated and not on auth route, redirect to login
      if (!isAuthenticated && !isAuthRoute) {
        return '/auth/login';
      }

      // If authenticated and on auth route, redirect to dashboard
      if (isAuthenticated && isAuthRoute) {
        return '/dashboard';
      }

      return null;
    },
    routes: [
      // Splash Screen
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),

      // Authentication Routes
      GoRoute(
        path: '/auth/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // Main App Routes
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/messaging',
        name: 'messaging',
        builder: (context, state) => const MessagingScreen(),
      ),
      GoRoute(
        path: '/player-comparison',
        name: 'player-comparison',
        builder: (context, state) => const PlayerComparisonScreen(),
      ),
      GoRoute(
        path: '/ai-insights',
        name: 'ai-insights',
        builder: (context, state) => const AIInsightsScreen(),
      ),
      GoRoute(
        path: '/advanced-stats',
        name: 'advanced-stats',
        builder: (context, state) => const AdvancedStatsScreen(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/test/academies',
        name: 'academy-test',
        builder: (context, state) => const AcademyTestScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'The page you are looking for does not exist.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/dashboard'),
              child: const Text('Go to Dashboard'),
            ),
          ],
        ),
      ),
    ),
  );
});

// Navigation helper methods
class AppRouter {
  static void goToLogin(BuildContext context) {
    context.go('/auth/login');
  }

  static void goToRegister(BuildContext context) {
    context.go('/auth/register');
  }

  static void goToDashboard(BuildContext context) {
    context.go('/dashboard');
  }

  static void goToMessaging(BuildContext context) {
    context.go('/messaging');
  }

  static void goToPlayerComparison(BuildContext context) {
    context.go('/player-comparison');
  }

  static void goToAIInsights(BuildContext context) {
    context.go('/ai-insights');
  }

  static void goToAdvancedStats(BuildContext context) {
    context.go('/advanced-stats');
  }

  static void goToProfile(BuildContext context) {
    context.go('/profile');
  }

  static void goBack(BuildContext context) {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/dashboard');
    }
  }

  static void goToAcademyTest(BuildContext context) {
    context.go('/test/academies');
  }
}