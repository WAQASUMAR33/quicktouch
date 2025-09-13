import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class FavoritesFab extends StatelessWidget {
  const FavoritesFab({super.key});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: () {
        _showFavoritesBottomSheet(context);
      },
      backgroundColor: AppTheme.accentGreen,
      foregroundColor: Colors.white,
      icon: const Icon(Icons.favorite),
      label: const Text('Favorites'),
    );
  }

  void _showFavoritesBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.lightCharcoal,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.3,
        maxChildSize: 0.9,
        builder: (context, scrollController) {
          return Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Handle bar
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppTheme.textSecondary,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Favorite Players',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textLight,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(
                        Icons.close,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Favorites List
                Expanded(
                  child: _buildFavoritesList(scrollController),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFavoritesList(ScrollController scrollController) {
    // Mock favorites data - replace with actual data from your API
    final favorites = [
      {
        'id': '1',
        'name': 'Alex Johnson',
        'position': 'Forward',
        'age': 17,
        'rating': 4.2,
        'addedDate': '2024-01-10',
      },
      {
        'id': '2',
        'name': 'Marcus Rodriguez',
        'position': 'Midfielder',
        'age': 16,
        'rating': 4.5,
        'addedDate': '2024-01-08',
      },
    ];

    if (favorites.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.favorite_border,
              size: 64,
              color: AppTheme.textSecondary.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            const Text(
              'No favorite players yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textLight,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Tap the heart icon on player cards to add favorites',
              style: TextStyle(
                fontSize: 14,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      controller: scrollController,
      itemCount: favorites.length,
      itemBuilder: (context, index) {
        final player = favorites[index];
        return _buildFavoriteItem(player, context);
      },
    );
  }

  Widget _buildFavoriteItem(Map<String, dynamic> player, BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.charcoal,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.accentGreen.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          // Player Avatar
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppTheme.accentGreen.withOpacity(0.2),
              borderRadius: BorderRadius.circular(25),
            ),
            child: const Icon(
              Icons.person,
              color: AppTheme.accentGreen,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          
          // Player Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  player['name'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textLight,
                  ),
                ),
                const SizedBox(height: 4),
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
                const SizedBox(height: 4),
                Text(
                  'Added on ${player['addedDate']}',
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          
          // Rating and Actions
          Column(
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.star,
                    color: Colors.amber,
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${player['rating']}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      // Navigate to player detail
                      Navigator.pop(context);
                      // Add navigation logic here
                    },
                    icon: const Icon(
                      Icons.visibility,
                      color: AppTheme.accentGreen,
                      size: 20,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      _removeFromFavorites(player['id'], context);
                    },
                    icon: const Icon(
                      Icons.favorite,
                      color: AppTheme.accentOrange,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _removeFromFavorites(String playerId, BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.lightCharcoal,
        title: const Text(
          'Remove from Favorites',
          style: TextStyle(color: AppTheme.textLight),
        ),
        content: const Text(
          'Are you sure you want to remove this player from your favorites?',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: AppTheme.textSecondary),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // Remove from favorites logic here
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Player removed from favorites'),
                  backgroundColor: AppTheme.accentOrange,
                ),
              );
            },
            child: const Text(
              'Remove',
              style: TextStyle(color: AppTheme.accentOrange),
            ),
          ),
        ],
      ),
    );
  }
}
