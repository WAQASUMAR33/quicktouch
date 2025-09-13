import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_theme.dart';
import '../../widgets/common/custom_app_bar.dart';
import '../../widgets/player/profile_header.dart';
import '../../widgets/player/stats_overview.dart';
import '../../widgets/player/highlight_videos.dart';
import '../../widgets/player/recent_evaluations.dart';

class PlayerProfileScreen extends ConsumerStatefulWidget {
  const PlayerProfileScreen({super.key});

  @override
  ConsumerState<PlayerProfileScreen> createState() => _PlayerProfileScreenState();
}

class _PlayerProfileScreenState extends ConsumerState<PlayerProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.charcoal,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            const CustomAppBar(
              title: 'Player Profile',
              showNotifications: true,
            ),
            SliverToBoxAdapter(
              child: ProfileHeader(
                playerName: 'Alex Johnson',
                position: 'Forward',
                age: 17,
                height: 1.75,
                profileImageUrl: null,
                onEditProfile: () {
                  // Navigate to edit profile
                },
              ),
            ),
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  indicatorColor: AppTheme.accentGreen,
                  labelColor: AppTheme.textLight,
                  unselectedLabelColor: AppTheme.textSecondary,
                  tabs: const [
                    Tab(text: 'Stats'),
                    Tab(text: 'Videos'),
                    Tab(text: 'Evaluations'),
                  ],
                ),
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: const [
            StatsOverview(),
            HighlightVideos(),
            RecentEvaluations(),
          ],
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;

  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;

  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: AppTheme.darkCharcoal,
      child: _tabBar,
    );
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
