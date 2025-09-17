import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Dio? _dio;
  String? _token;
  
  // Base URL - Local development API endpoint
  static const String baseUrl = 'http://localhost:3000/api';
  
  void initialize() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
    
    // Dio instance is now initialized

    // Add interceptors
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add auth token to requests
        if (_token != null) {
          options.headers['Authorization'] = 'Bearer $_token';
        }
        
        // Debug logging
        print('🚀 API Request: ${options.method} ${options.path}');
        print('📤 Request Data: ${options.data}');
        print('📋 Headers: ${options.headers}');
        
        handler.next(options);
      },
      onResponse: (response, handler) {
        // Debug logging
        print('✅ API Response: ${response.statusCode} ${response.requestOptions.path}');
        print('📥 Response Data: ${response.data}');
        
        handler.next(response);
      },
      onError: (error, handler) {
        // Debug logging
        print('❌ API Error: ${error.response?.statusCode} ${error.requestOptions.path}');
        print('📥 Error Data: ${error.response?.data}');
        print('📝 Error Message: ${error.message}');
        
        // Handle common errors
        if (error.response?.statusCode == 401) {
          // Token expired, clear and redirect to login
          clearToken();
        }
        handler.next(error);
      },
    ));
  }

  // Authentication Methods
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      // Ensure Dio is initialized
      if (_dio == null) {
        initialize();
      }
      
      final response = await _dio!.post('/login', data: {
        'email': email,
        'password': password,
      });
      
      if (response.statusCode == 200) {
        _token = response.data['token'];
        await _saveToken(_token!);
        
        // Save user data
        if (response.data['user'] != null) {
          await _saveUserData(response.data['user']);
        }
        
        return response.data;
      }
      throw Exception('Login failed');
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Invalid email or password');
      } else if (e.response?.statusCode == 400) {
        throw Exception('Invalid request format');
      } else {
        throw Exception('Login error: ${e.response?.data?['message'] ?? e.message}');
      }
    } catch (e) {
      throw Exception('Login error: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    try {
      if (!isAuthenticated) return null;
      
      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString('user_data');
      if (userData != null) {
        return Map<String, dynamic>.from(json.decode(userData));
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    try {
      // Ensure Dio is initialized
      if (_dio == null) {
        initialize();
      }
      
      // Transform data to match server expectations
      final cleanedData = {
        'fullName': '${userData['firstName']} ${userData['lastName']}', // Combine first and last name
        'email': userData['email'],
        'password': userData['password'],
        'role': userData['role'],
        'academyId': userData['academyId'], // Required field
        if (userData['phone'] != null && userData['phone'].isNotEmpty)
          'phone': userData['phone'],
      };
      
      print('📤 Sending registration data: $cleanedData');
      
      final response = await _dio!.post('/users/test', data: cleanedData);
      
      // Handle successful registration
      if (response.statusCode == 201) {
        return {
          'success': true,
          'message': response.data['message'],
          'user': response.data['user'],
        };
      }
      
      return response.data;
    } on DioException catch (e) {
      print('❌ DioException in register: ${e.response?.statusCode}');
      print('❌ Error data: ${e.response?.data}');
      
      if (e.response?.statusCode == 400) {
        final errorMessage = e.response?.data?['error'] ?? 
                           e.response?.data?['message'] ?? 
                           'Invalid registration data';
        throw Exception(errorMessage);
      } else if (e.response?.statusCode == 409) {
        throw Exception('User with this email already exists');
      } else if (e.response?.statusCode == 500) {
        throw Exception('Server error. Please try again later.');
      } else {
        throw Exception('Registration error: ${e.response?.data?['error'] ?? e.message}');
      }
    } catch (e) {
      print('❌ General error in register: $e');
      throw Exception('Registration error: ${e.toString()}');
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/logout');
    } catch (e) {
      // Continue with logout even if API call fails
    } finally {
      await clearToken();
      await clearUserData();
    }
  }

  // Academy Management
  Future<List<dynamic>> getAcademies() async {
    try {
      print('🔍 Fetching academies from: ${baseUrl}/academy_management');
      final response = await _dio.get('/academy_management');
      print('✅ Academies response: ${response.data}');
      
      // Handle different response formats
      if (response.data is List) {
        return response.data;
      } else if (response.data is Map && response.data['academies'] != null) {
        return response.data['academies'];
      } else if (response.data is Map && response.data['data'] != null) {
        return response.data['data'];
      } else {
        print('⚠️ Unexpected response format: ${response.data}');
        return [];
      }
    } on DioException catch (e) {
      print('❌ DioException when fetching academies:');
      print('   Status: ${e.response?.statusCode}');
      print('   Message: ${e.message}');
      print('   Response: ${e.response?.data}');
      
      // Return default academies if API fails
      return [
        {'id': 'academy-1', 'name': 'Quick Touch Academy - Main Campus'},
        {'id': 'academy-2', 'name': 'Quick Touch Academy - Karachi Branch'},
        {'id': 'academy-3', 'name': 'Quick Touch Academy - Islamabad Branch'},
      ];
    } catch (e) {
      print('❌ General error when fetching academies: $e');
      return [
        {'id': 'academy-1', 'name': 'Quick Touch Academy - Main Campus'},
      ];
    }
  }

  // User Management
  Future<List<dynamic>> getUsers({String? academyId, String? role}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (academyId != null) queryParams['academyId'] = academyId;
      if (role != null) queryParams['role'] = role;
      
      final response = await _dio.get('/users', queryParameters: queryParams);
      return response.data['users'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch users: ${e.toString()}');
    }
  }


  // Player Management
  Future<List<dynamic>> getPlayers({String? academyId, String? position, int? ageMin, int? ageMax}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (academyId != null) queryParams['academyId'] = academyId;
      if (position != null) queryParams['position'] = position;
      if (ageMin != null) queryParams['ageMin'] = ageMin;
      if (ageMax != null) queryParams['ageMax'] = ageMax;
      
      final response = await _dio.get('/players_management', queryParameters: queryParams);
      return response.data['players'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch players: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> createPlayer(Map<String, dynamic> playerData) async {
    try {
      final response = await _dio.post('/players_management', data: playerData);
      return response.data;
    } catch (e) {
      throw Exception('Failed to create player: ${e.toString()}');
    }
  }

  // Messaging System
  Future<List<dynamic>> getConversations() async {
    try {
      final response = await _dio.get('/messaging/conversations');
      return response.data['conversations'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch conversations: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> createConversation(String participantId) async {
    try {
      final response = await _dio.post('/messaging/conversations', data: {
        'participantId': participantId,
      });
      return response.data;
    } catch (e) {
      throw Exception('Failed to create conversation: ${e.toString()}');
    }
  }

  Future<List<dynamic>> getMessages(String conversationId) async {
    try {
      final response = await _dio.get('/messaging/conversations/$conversationId/messages');
      return response.data['messages'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch messages: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> sendMessage(String conversationId, String content, {String? messageType, String? mediaUrl}) async {
    try {
      final response = await _dio.post('/messaging/conversations/$conversationId/messages', data: {
        'content': content,
        'messageType': messageType ?? 'text',
        'mediaUrl': mediaUrl,
      });
      return response.data;
    } catch (e) {
      throw Exception('Failed to send message: ${e.toString()}');
    }
  }

  Future<List<dynamic>> getMessagingUsers({String? role, String? search}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (role != null) queryParams['role'] = role;
      if (search != null) queryParams['search'] = search;
      
      final response = await _dio.get('/messaging/users', queryParameters: queryParams);
      return response.data['users'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch messaging users: ${e.toString()}');
    }
  }

  // Player Comparison
  Future<List<dynamic>> getPlayerComparisons() async {
    try {
      final response = await _dio.get('/player-comparison');
      return response.data['comparisons'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch player comparisons: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> createPlayerComparison(String player1Id, String player2Id, {String? notes}) async {
    try {
      final response = await _dio.post('/player-comparison', data: {
        'player1Id': player1Id,
        'player2Id': player2Id,
        'notes': notes,
      });
      return response.data;
    } catch (e) {
      throw Exception('Failed to create player comparison: ${e.toString()}');
    }
  }

  // AI Insights
  Future<List<dynamic>> getAIInsights(String playerId, {String? type}) async {
    try {
      final queryParams = {'playerId': playerId};
      if (type != null) queryParams['type'] = type;
      
      final response = await _dio.get('/ai-insights', queryParameters: queryParams);
      return response.data['insights'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch AI insights: ${e.toString()}');
    }
  }

  Future<List<dynamic>> getVideoAnalyses(String playerId) async {
    try {
      final response = await _dio.get('/ai-insights/video-analysis', queryParameters: {
        'playerId': playerId,
      });
      return response.data['videoAnalyses'] ?? [];
    } catch (e) {
      throw Exception('Failed to fetch video analyses: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>> uploadVideoForAnalysis(String playerId, String videoUrl) async {
    try {
      final response = await _dio.post('/ai-insights/video-analysis', data: {
        'playerId': playerId,
        'videoUrl': videoUrl,
      });
      return response.data;
    } catch (e) {
      throw Exception('Failed to upload video for analysis: ${e.toString()}');
    }
  }

  // Advanced Statistics
  Future<Map<String, dynamic>> getAdvancedStats(String playerId, {String? matchId}) async {
    try {
      final queryParams = {'playerId': playerId};
      if (matchId != null) queryParams['matchId'] = matchId;
      
      final response = await _dio.get('/advanced-stats', queryParameters: queryParams);
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch advanced stats: ${e.toString()}');
    }
  }

  // Token Management
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> _saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_data', json.encode(userData));
  }

  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
  }

  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<void> clearUserData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
  }

  // Test API connection
  Future<bool> testConnection() async {
    try {
      final response = await _dio.get('/health');
      return response.statusCode == 200;
    } catch (e) {
      print('🔍 API Connection Test Failed: $e');
      return false;
    }
  }

  bool get isAuthenticated => _token != null;
  String? get token => _token;
}