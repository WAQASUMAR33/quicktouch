import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/scout/player_search_bar.dart';
import '../../widgets/scout/filter_chips.dart';
import '../../widgets/scout/player_grid.dart';
import '../../widgets/scout/favorites_fab.dart';

class ScoutPlayersScreen extends ConsumerStatefulWidget {
  const ScoutPlayersScreen({super.key});

  @override
  ConsumerState<ScoutPlayersScreen> createState() => _ScoutPlayersScreenState();
}

class _ScoutPlayersScreenState extends ConsumerState<ScoutPlayersScreen> {
  String _searchQuery = '';
  String _selectedPosition = 'All';
  String _selectedAgeGroup = 'All';
  String _sortBy = 'Rating';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            const CustomAppBar(
              title: 'Scout Portal',
              showNotifications: true,
            ),
            SliverToBoxAdapter(
              child: Container(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // VIP Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.amber, Colors.orange],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.star, color: Colors.white, size: 16),
                          SizedBox(width: 4),
                          Text(
                            'SCOUT VIP ACCESS',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Search Bar
                    PlayerSearchBar(
                      onSearchChanged: (query) {
                        setState(() => _searchQuery = query);
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    // Filter Chips
                    FilterChips(
                      selectedPosition: _selectedPosition,
                      selectedAgeGroup: _selectedAgeGroup,
                      sortBy: _sortBy,
                      onPositionChanged: (position) {
                        setState(() => _selectedPosition = position);
                      },
                      onAgeGroupChanged: (ageGroup) {
                        setState(() => _selectedAgeGroup = ageGroup);
                      },
                      onSortChanged: (sort) {
                        setState(() => _sortBy = sort);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ];
        },
        body: PlayerGrid(
          searchQuery: _searchQuery,
          selectedPosition: _selectedPosition,
          selectedAgeGroup: _selectedAgeGroup,
          sortBy: _sortBy,
        ),
      ),
      floatingActionButton: const FavoritesFab(),
    );
  }
}
