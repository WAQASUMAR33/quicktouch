import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_theme.dart';

class PlayerGrid extends StatelessWidget {
  final String searchQuery;
  final String selectedPosition;
  final String selectedAgeGroup;
  final String sortBy;

  const PlayerGrid({
    super.key,
    required this.searchQuery,
    required this.selectedPosition,
    required this.selectedAgeGroup,
    required this.sortBy,
  });

  @override
  Widget build(BuildContext context) {
    // Mock player data - replace with actual data from your API
    final players = _getFilteredPlayers();

    if (players.isEmpty) {
      return _buildEmptyState();
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: players.length,
      itemBuilder: (context, index) {
        return _buildPlayerCard(players[index], context);
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 64,
            color: AppTheme.textSecondary.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          const Text(
            'No players found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textLight,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Try adjusting your search criteria',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerCard(Map<String, dynamic> player, BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to player detail screen
        Navigator.pushNamed(context, '/scout/player/${player['id']}');
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.lightCharcoal,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppTheme.accentGreen.withOpacity(0.3),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Player Image
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                ),
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: player['imageUrl'] != null
                      ? CachedNetworkImage(
                          imageUrl: player['imageUrl'],
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: AppTheme.charcoal,
                            child: const Center(
                              child: CircularProgressIndicator(
                                color: AppTheme.accentGreen,
                              ),
                            ),
                          ),
                          errorWidget: (context, url, error) => _buildPlaceholderImage(),
                        )
                      : _buildPlaceholderImage(),
                ),
              ),
            ),
            
            // Player Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name and Age
                    Text(
                      player['name'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textLight,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    
                    // Position and Age
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.accentGreen.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            player['position'],
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppTheme.accentGreen,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Age ${player['age']}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    
                    const Spacer(),
                    
                    // Stats Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildStat('G', player['goals'], AppTheme.accentGreen),
                        _buildStat('A', player['assists'], AppTheme.accentBlue),
                        _buildStat('★', player['rating'], Colors.amber),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderImage() {
    return Container(
      color: AppTheme.charcoal,
      child: const Center(
        child: Icon(
          Icons.person,
          size: 40,
          color: AppTheme.textSecondary,
        ),
      ),
    );
  }

  Widget _buildStat(String label, dynamic value, Color color) {
    return Column(
      children: [
        Text(
          '$value',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  List<Map<String, dynamic>> _getFilteredPlayers() {
    // Mock player data - replace with actual API call
    final allPlayers = [
      {
        'id': '1',
        'name': 'Alex Johnson',
        'position': 'Forward',
        'age': 17,
        'goals': 12,
        'assists': 8,
        'rating': 4.2,
        'imageUrl': null,
      },
      {
        'id': '2',
        'name': 'Marcus Rodriguez',
        'position': 'Midfielder',
        'age': 16,
        'goals': 5,
        'assists': 15,
        'rating': 4.5,
        'imageUrl': null,
      },
      {
        'id': '3',
        'name': 'David Chen',
        'position': 'Defender',
        'age': 18,
        'goals': 2,
        'assists': 3,
        'rating': 4.0,
        'imageUrl': null,
      },
      {
        'id': '4',
        'name': 'James Wilson',
        'position': 'Goalkeeper',
        'age': 17,
        'goals': 0,
        'assists': 1,
        'rating': 4.3,
        'imageUrl': null,
      },
      {
        'id': '5',
        'name': 'Liam O\'Connor',
        'position': 'Forward',
        'age': 16,
        'goals': 18,
        'assists': 6,
        'rating': 4.7,
        'imageUrl': null,
      },
      {
        'id': '6',
        'name': 'Ethan Brown',
        'position': 'Midfielder',
        'age': 18,
        'goals': 8,
        'assists': 12,
        'rating': 4.1,
        'imageUrl': null,
      },
    ];

    // Apply filters
    var filteredPlayers = allPlayers.where((player) {
      // Search filter
      if (searchQuery.isNotEmpty) {
        final query = searchQuery.toLowerCase();
        if (!player['name'].toLowerCase().contains(query) &&
            !player['position'].toLowerCase().contains(query)) {
          return false;
        }
      }

      // Position filter
      if (selectedPosition != 'All' && player['position'] != selectedPosition) {
        return false;
      }

      // Age group filter
      if (selectedAgeGroup != 'All') {
        final age = player['age'] as int;
        switch (selectedAgeGroup) {
          case 'U16':
            if (age >= 16) return false;
            break;
          case 'U17':
            if (age < 16 || age >= 17) return false;
            break;
          case 'U18':
            if (age < 17 || age >= 18) return false;
            break;
          case 'U19':
            if (age < 18 || age >= 19) return false;
            break;
          case 'U20':
            if (age < 19 || age >= 20) return false;
            break;
        }
      }

      return true;
    }).toList();

    // Apply sorting
    switch (sortBy) {
      case 'Rating':
        filteredPlayers.sort((a, b) => (b['rating'] as double).compareTo(a['rating'] as double));
        break;
      case 'Goals':
        filteredPlayers.sort((a, b) => (b['goals'] as int).compareTo(a['goals'] as int));
        break;
      case 'Assists':
        filteredPlayers.sort((a, b) => (b['assists'] as int).compareTo(a['assists'] as int));
        break;
      case 'Age':
        filteredPlayers.sort((a, b) => (a['age'] as int).compareTo(b['age'] as int));
        break;
      case 'Recent':
        // Sort by most recent (mock implementation)
        filteredPlayers = filteredPlayers.reversed.toList();
        break;
    }

    return filteredPlayers;
  }
}
