import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class PlayerStatsScreen extends StatelessWidget {
  const PlayerStatsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      appBar: AppBar(
        title: const Text('Player Stats'),
        backgroundColor: AppTheme.darkCharcoal,
      ),
      body: const Center(
        child: Text(
          'Player Stats\nComing Soon!',
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
