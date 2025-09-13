import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class FilterChips extends StatelessWidget {
  final String selectedPosition;
  final String selectedAgeGroup;
  final String sortBy;
  final Function(String) onPositionChanged;
  final Function(String) onAgeGroupChanged;
  final Function(String) onSortChanged;

  const FilterChips({
    super.key,
    required this.selectedPosition,
    required this.selectedAgeGroup,
    required this.sortBy,
    required this.onPositionChanged,
    required this.onAgeGroupChanged,
    required this.onSortChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Position Filter
        _buildFilterSection(
          'Position',
          ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
          selectedPosition,
          onPositionChanged,
        ),
        const SizedBox(height: 12),
        
        // Age Group Filter
        _buildFilterSection(
          'Age Group',
          ['All', 'U16', 'U17', 'U18', 'U19', 'U20'],
          selectedAgeGroup,
          onAgeGroupChanged,
        ),
        const SizedBox(height: 12),
        
        // Sort Options
        _buildFilterSection(
          'Sort By',
          ['Rating', 'Goals', 'Assists', 'Age', 'Recent'],
          sortBy,
          onSortChanged,
        ),
      ],
    );
  }

  Widget _buildFilterSection(
    String title,
    List<String> options,
    String selectedValue,
    Function(String) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppTheme.textLight,
          ),
        ),
        const SizedBox(height: 8),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: options.map((option) {
              final isSelected = option == selectedValue;
              return Container(
                margin: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(
                    option,
                    style: TextStyle(
                      color: isSelected ? Colors.white : AppTheme.textLight,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) {
                      onChanged(option);
                    }
                  },
                  backgroundColor: AppTheme.lightCharcoal,
                  selectedColor: AppTheme.accentGreen,
                  checkmarkColor: Colors.white,
                  side: BorderSide(
                    color: isSelected ? AppTheme.accentGreen : AppTheme.textSecondary,
                    width: 1,
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
