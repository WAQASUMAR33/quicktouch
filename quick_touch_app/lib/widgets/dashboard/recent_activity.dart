import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class RecentActivity extends StatelessWidget {
  const RecentActivity({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data - replace with actual data from your service
    final activities = [
      {
        'title': 'New evaluation received',
        'subtitle': 'Coach Johnson rated your performance',
        'time': '2 hours ago',
        'icon': Icons.assessment,
        'color': AppTheme.accentBlue,
      },
      {
        'title': 'Training session completed',
        'subtitle': 'Great work on today\'s drills!',
        'time': '1 day ago',
        'icon': Icons.sports_soccer,
        'color': AppTheme.accentGreen,
      },
      {
        'title': 'Match reminder',
        'subtitle': 'Friendly match tomorrow at 2:00 PM',
        'time': '2 days ago',
        'icon': Icons.sports,
        'color': AppTheme.accentOrange,
      },
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Activity',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.textLight,
            ),
          ),
          const SizedBox(height: 16),
          ...activities.map((activity) => _buildActivityItem(
            title: activity['title'] as String,
            subtitle: activity['subtitle'] as String,
            time: activity['time'] as String,
            icon: activity['icon'] as IconData,
            color: activity['color'] as Color,
          )),
        ],
      ),
    );
  }

  Widget _buildActivityItem({
    required String title,
    required String subtitle,
    required String time,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: color,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
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
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
