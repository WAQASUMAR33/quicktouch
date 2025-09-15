import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize API Service
  final apiService = ApiService();
  apiService.initialize();
  
  // Test API connection
  final isConnected = await apiService.testConnection();
  print('🌐 API Connection: ${isConnected ? "✅ Connected" : "❌ Failed"}');
  
  runApp(
    const ProviderScope(
      child: QuickTouchApp(),
    ),
  );
}

class QuickTouchApp extends ConsumerWidget {
  const QuickTouchApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    
    return MaterialApp.router(
      title: 'Quick Touch Academy',
      theme: AppTheme.darkTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}