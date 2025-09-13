import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class CoachPlayersScreen extends StatelessWidget {
  const CoachPlayersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      appBar: AppBar(
        title: const Text('My Players'),
        backgroundColor: AppTheme.darkCharcoal,
      ),
      body: const Center(
        child: Text(
          'Coach Players Management\nComing Soon!',
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
