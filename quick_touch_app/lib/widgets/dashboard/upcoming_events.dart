import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/event_model.dart';

class UpcomingEvents extends StatelessWidget {
  const UpcomingEvents({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data - replace with actual data from your service
    final upcomingEvents = [
      {
        'title': 'Training Session',
        'date': 'Today, 4:00 PM',
        'location': 'Main Field',
        'type': EventType.training,
      },
      {
        'title': 'Friendly Match',
        'date': 'Tomorrow, 2:00 PM',
        'location': 'Stadium A',
        'type': EventType.match,
      },
      {
        'title': 'Scout Showcase',
        'date': 'Friday, 6:00 PM',
        'location': 'Training Center',
        'type': EventType.showcase,
      },
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Upcoming Events',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textLight,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to calendar screen
                },
                child: const Text(
                  'View All',
                  style: TextStyle(
                    color: AppTheme.accentGreen,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...upcomingEvents.map((event) => _buildEventCard(
            title: event['title'] as String,
            date: event['date'] as String,
            location: event['location'] as String,
            type: event['type'] as EventType,
          )),
        ],
      ),
    );
  }

  Widget _buildEventCard({
    required String title,
    required String date,
    required String location,
    required EventType type,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.accentGreen.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppTheme.accentGreen.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                type.typeIcon,
                style: const TextStyle(fontSize: 24),
              ),
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
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textLight,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.accentGreen,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  location,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.arrow_forward_ios,
            color: AppTheme.textSecondary,
            size: 16,
          ),
        ],
      ),
    );
  }
}
