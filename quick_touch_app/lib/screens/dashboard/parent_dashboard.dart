import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/common/custom_app_bar.dart';

class ParentDashboard extends ConsumerWidget {
  const ParentDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      appBar: const CustomAppBar(
        title: 'Parent Dashboard',
        showNotifications: true,
      ),
      body: const Center(
        child: Text(
          'Parent Dashboard\nComing Soon!',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 24,
            color: AppTheme.textLight,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
