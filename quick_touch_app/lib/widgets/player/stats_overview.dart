import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme/app_theme.dart';

class StatsOverview extends StatelessWidget {
  const StatsOverview({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Season Stats
          _buildSectionTitle('Season Statistics'),
          const SizedBox(height: 16),
          _buildSeasonStats(),
          
          const SizedBox(height: 24),
          
          // Performance Chart
          _buildSectionTitle('Performance Trend'),
          const SizedBox(height: 16),
          _buildPerformanceChart(),
          
          const SizedBox(height: 24),
          
          // Recent Matches
          _buildSectionTitle('Recent Matches'),
          const SizedBox(height: 16),
          _buildRecentMatches(),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: AppTheme.textLight,
      ),
    );
  }

  Widget _buildSeasonStats() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Matches', '15', Icons.sports, AppTheme.accentBlue),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard('Goals', '12', Icons.sports_soccer, AppTheme.accentGreen),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Assists', '8', Icons.assistant, AppTheme.accentOrange),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard('Minutes', '1,200', Icons.timer, Colors.purple),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.charcoal,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceChart() {
    return Container(
      height: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(16),
      ),
      child: LineChart(
        LineChartData(
          gridData: FlGridData(show: false),
          titlesData: FlTitlesData(
            leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  const titles = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
                  if (value.toInt() >= 0 && value.toInt() < titles.length) {
                    return Text(
                      titles[value.toInt()],
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    );
                  }
                  return const Text('');
                },
              ),
            ),
          ),
          borderData: FlBorderData(show: false),
          lineBarsData: [
            LineChartBarData(
              spots: const [
                FlSpot(0, 3),
                FlSpot(1, 4),
                FlSpot(2, 3.5),
                FlSpot(3, 4.5),
                FlSpot(4, 4.2),
              ],
              isCurved: true,
              color: AppTheme.accentGreen,
              barWidth: 3,
              dotData: FlDotData(show: true),
              belowBarData: BarAreaData(
                show: true,
                color: AppTheme.accentGreen.withOpacity(0.1),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentMatches() {
    final matches = [
      {
        'opponent': 'City FC',
        'date': '2024-01-15',
        'result': 'W 3-1',
        'goals': 2,
        'assists': 1,
        'rating': 4.5,
      },
      {
        'opponent': 'United Academy',
        'date': '2024-01-08',
        'result': 'D 2-2',
        'goals': 1,
        'assists': 0,
        'rating': 3.8,
      },
      {
        'opponent': 'Rangers Youth',
        'date': '2024-01-01',
        'result': 'W 4-0',
        'goals': 3,
        'assists': 1,
        'rating': 4.8,
      },
    ];

    return Column(
      children: matches.map((match) => _buildMatchCard(match)).toList(),
    );
  }

  Widget _buildMatchCard(Map<String, dynamic> match) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  match['opponent'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textLight,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  match['date'],
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Column(
            children: [
              Text(
                match['result'],
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.accentGreen,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  _buildMatchStat('G', match['goals'], AppTheme.accentGreen),
                  const SizedBox(width: 8),
                  _buildMatchStat('A', match['assists'], AppTheme.accentBlue),
                  const SizedBox(width: 8),
                  _buildMatchStat('★', match['rating'], Colors.amber),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMatchStat(String label, dynamic value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        '$label $value',
        style: TextStyle(
          fontSize: 10,
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
