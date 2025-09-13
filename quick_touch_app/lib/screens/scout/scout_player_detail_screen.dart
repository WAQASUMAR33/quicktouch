import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class ScoutPlayerDetailScreen extends StatelessWidget {
  final String playerId;
  
  const ScoutPlayerDetailScreen({
    super.key,
    required this.playerId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      appBar: AppBar(
        title: const Text('Player Details'),
        backgroundColor: AppTheme.darkCharcoal,
      ),
      body: Center(
        child: Text(
          'Player Details for ID: $playerId\nComing Soon!',
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 24,
            color: AppTheme.textLight,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
