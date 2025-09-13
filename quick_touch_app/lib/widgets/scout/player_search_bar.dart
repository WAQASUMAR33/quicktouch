import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class PlayerSearchBar extends StatelessWidget {
  final Function(String) onSearchChanged;
  final String hintText;

  const PlayerSearchBar({
    super.key,
    required this.onSearchChanged,
    this.hintText = 'Search players by name, position, or skills...',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.accentGreen.withOpacity(0.3),
        ),
      ),
      child: TextField(
        onChanged: onSearchChanged,
        style: const TextStyle(color: AppTheme.textLight),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: const TextStyle(color: AppTheme.textSecondary),
          prefixIcon: const Icon(
            Icons.search,
            color: AppTheme.accentGreen,
          ),
          suffixIcon: IconButton(
            icon: const Icon(
              Icons.filter_list,
              color: AppTheme.textSecondary,
            ),
            onPressed: () {
              // Show advanced filters
            },
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
    );
  }
}
