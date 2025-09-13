import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../../core/theme/app_theme.dart';

class HighlightVideos extends StatefulWidget {
  const HighlightVideos({super.key});

  @override
  State<HighlightVideos> createState() => _HighlightVideosState();
}

class _HighlightVideosState extends State<HighlightVideos> {
  // Mock video data - replace with actual data from your API
  final List<Map<String, dynamic>> videos = [
    {
      'title': 'Best Goals 2024',
      'duration': '2:45',
      'thumbnail': null,
      'url': 'https://example.com/video1.mp4',
      'views': 1250,
      'date': '2024-01-15',
    },
    {
      'title': 'Training Highlights',
      'duration': '1:30',
      'thumbnail': null,
      'url': 'https://example.com/video2.mp4',
      'views': 890,
      'date': '2024-01-10',
    },
    {
      'title': 'Match Performance',
      'duration': '3:20',
      'thumbnail': null,
      'url': 'https://example.com/video3.mp4',
      'views': 2100,
      'date': '2024-01-05',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with upload button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Highlight Videos',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textLight,
                ),
              ),
              ElevatedButton.icon(
                onPressed: _uploadVideo,
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Upload'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.accentGreen,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Videos Grid
          if (videos.isEmpty)
            _buildEmptyState()
          else
            Column(
              children: videos.map((video) => _buildVideoCard(video)).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.accentGreen.withOpacity(0.3),
          style: BorderStyle.solid,
          width: 2,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.video_library_outlined,
              size: 64,
              color: AppTheme.accentGreen.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            const Text(
              'No videos uploaded yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textLight,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Upload your highlight videos to showcase your skills',
              style: TextStyle(
                fontSize: 14,
                color: AppTheme.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _uploadVideo,
              icon: const Icon(Icons.upload, size: 18),
              label: const Text('Upload First Video'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accentGreen,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoCard(Map<String, dynamic> video) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.lightCharcoal,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Video Thumbnail
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppTheme.charcoal,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
            ),
            child: Stack(
              children: [
                // Placeholder for video thumbnail
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.play_circle_outline,
                        size: 64,
                        color: AppTheme.accentGreen.withOpacity(0.7),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tap to play',
                        style: TextStyle(
                          color: AppTheme.accentGreen.withOpacity(0.7),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
                // Duration badge
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      video['duration'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
                // Play button overlay
                Positioned.fill(
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => _playVideo(video),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Video Info
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  video['title'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textLight,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(
                      Icons.visibility,
                      size: 16,
                      color: AppTheme.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${video['views']} views',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Icon(
                      Icons.calendar_today,
                      size: 16,
                      color: AppTheme.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      video['date'],
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _playVideo(video),
                        icon: const Icon(Icons.play_arrow, size: 18),
                        label: const Text('Play'),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.accentGreen),
                          foregroundColor: AppTheme.accentGreen,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: () => _shareVideo(video),
                      icon: const Icon(Icons.share),
                      color: AppTheme.textSecondary,
                    ),
                    IconButton(
                      onPressed: () => _deleteVideo(video),
                      icon: const Icon(Icons.delete),
                      color: AppTheme.accentOrange,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _uploadVideo() {
    // Implement video upload functionality
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.lightCharcoal,
        title: const Text(
          'Upload Video',
          style: TextStyle(color: AppTheme.textLight),
        ),
        content: const Text(
          'Video upload functionality will be implemented here.',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'OK',
              style: TextStyle(color: AppTheme.accentGreen),
            ),
          ),
        ],
      ),
    );
  }

  void _playVideo(Map<String, dynamic> video) {
    // Implement video playback
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.lightCharcoal,
        title: Text(
          video['title'],
          style: const TextStyle(color: AppTheme.textLight),
        ),
        content: const Text(
          'Video player will be implemented here.',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Close',
              style: TextStyle(color: AppTheme.accentGreen),
            ),
          ),
        ],
      ),
    );
  }

  void _shareVideo(Map<String, dynamic> video) {
    // Implement video sharing
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sharing ${video['title']}...'),
        backgroundColor: AppTheme.accentGreen,
      ),
    );
  }

  void _deleteVideo(Map<String, dynamic> video) {
    // Implement video deletion
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.lightCharcoal,
        title: const Text(
          'Delete Video',
          style: TextStyle(color: AppTheme.textLight),
        ),
        content: Text(
          'Are you sure you want to delete "${video['title']}"?',
          style: const TextStyle(color: AppTheme.textSecondary),
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
              // Delete video logic here
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('${video['title']} deleted'),
                  backgroundColor: AppTheme.accentOrange,
                ),
              );
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: AppTheme.accentOrange),
            ),
          ),
        ],
      ),
    );
  }
}
