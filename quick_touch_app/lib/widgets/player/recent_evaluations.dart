import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/feedback_model.dart';

class RecentEvaluations extends StatelessWidget {
  const RecentEvaluations({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock evaluation data - replace with actual data from your API
    final evaluations = [
      {
        'coachName': 'Coach Johnson',
        'date': '2024-01-15',
        'rating': 4,
        'notes': 'Excellent performance in today\'s training session. Great ball control and passing accuracy. Keep up the good work!',
        'categories': {
          'Technical Skills': 4,
          'Physical Fitness': 3,
          'Tactical Awareness': 5,
          'Teamwork': 4,
        },
      },
      {
        'coachName': 'Coach Martinez',
        'date': '2024-01-10',
        'rating': 5,
        'notes': 'Outstanding match performance! Scored two goals and provided one assist. Leadership qualities are really showing.',
        'categories': {
          'Technical Skills': 5,
          'Physical Fitness': 4,
          'Tactical Awareness': 5,
          'Teamwork': 5,
        },
      },
      {
        'coachName': 'Coach Wilson',
        'date': '2024-01-05',
        'rating': 3,
        'notes': 'Good effort in training. Need to work on defensive positioning and communication with teammates.',
        'categories': {
          'Technical Skills': 3,
          'Physical Fitness': 4,
          'Tactical Awareness': 3,
          'Teamwork': 3,
        },
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Coach Evaluations',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textLight,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all evaluations
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
          
          // Overall Rating Summary
          _buildOverallRating(),
          
          const SizedBox(height: 24),
          
          // Recent Evaluations
          const Text(
            'Recent Evaluations',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textLight,
            ),
          ),
          const SizedBox(height: 16),
          
          // Evaluations List
          Column(
            children: evaluations.map((evaluation) => _buildEvaluationCard(evaluation)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildOverallRating() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppTheme.accentBlue, AppTheme.accentGreen],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Overall Rating',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                '4.2',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: List.generate(5, (index) {
                      return Icon(
                        index < 4 ? Icons.star : Icons.star_border,
                        color: Colors.amber,
                        size: 20,
                      );
                    }),
                  ),
                  const Text(
                    'Out of 5.0',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildRatingStat('Technical', '4.3', Icons.sports_soccer),
              _buildRatingStat('Physical', '3.8', Icons.fitness_center),
              _buildRatingStat('Tactical', '4.4', Icons.psychology),
              _buildRatingStat('Teamwork', '4.0', Icons.group),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRatingStat(String label, String rating, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(height: 4),
        Text(
          rating,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 10,
          ),
        ),
      ],
    );
  }

  Widget _buildEvaluationCard(Map<String, dynamic> evaluation) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _getRatingColor(evaluation['rating']).withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    evaluation['coachName'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textLight,
                    ),
                  ),
                  Text(
                    evaluation['date'],
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getRatingColor(evaluation['rating']).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.star,
                      color: _getRatingColor(evaluation['rating']),
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${evaluation['rating']}/5',
                      style: TextStyle(
                        color: _getRatingColor(evaluation['rating']),
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 12),
          
          // Notes
          Text(
            evaluation['notes'],
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textLight,
              height: 1.4,
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Category Ratings
          const Text(
            'Category Ratings',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppTheme.textLight,
            ),
          ),
          const SizedBox(height: 8),
          ...evaluation['categories'].entries.map((entry) => _buildCategoryRating(
            entry.key,
            entry.value,
          )),
        ],
      ),
    );
  }

  Widget _buildCategoryRating(String category, int rating) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            category,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
          Row(
            children: List.generate(5, (index) {
              return Icon(
                index < rating ? Icons.star : Icons.star_border,
                color: index < rating ? Colors.amber : AppTheme.textSecondary,
                size: 16,
              );
            }),
          ),
        ],
      ),
    );
  }

  Color _getRatingColor(int rating) {
    switch (rating) {
      case 5:
        return Colors.green;
      case 4:
        return AppTheme.accentGreen;
      case 3:
        return Colors.orange;
      case 2:
        return AppTheme.accentOrange;
      case 1:
        return Colors.red;
      default:
        return AppTheme.textSecondary;
    }
  }
}
