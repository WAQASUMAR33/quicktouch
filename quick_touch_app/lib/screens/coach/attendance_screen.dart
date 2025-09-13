import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class AttendanceScreen extends StatelessWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      appBar: AppBar(
        title: const Text('Attendance'),
        backgroundColor: AppTheme.darkCharcoal,
      ),
      body: const Center(
        child: Text(
          'Attendance Management\nComing Soon!',
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
