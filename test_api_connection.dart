import 'dart:io';
import 'package:http/http.dart' as http;

void main() async {
  print('Testing Quick Touch Academy API Connection...');
  
  try {
    // Test the production API endpoint
    final response = await http.get(
      Uri.parse('https://quicktouch.vercel.app/api/test'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ).timeout(Duration(seconds: 10));
    
    print('API Status Code: ${response.statusCode}');
    print('API Response: ${response.body}');
    
    if (response.statusCode == 200) {
      print('✅ API Connection: SUCCESS');
      print('✅ Production API is working correctly');
    } else {
      print('❌ API Connection: FAILED');
      print('❌ Status Code: ${response.statusCode}');
    }
  } catch (e) {
    print('❌ API Connection: ERROR');
    print('❌ Error: $e');
  }
  
  // Test login endpoint
  try {
    print('\nTesting Login Endpoint...');
    final loginResponse = await http.post(
      Uri.parse('https://quicktouch.vercel.app/api/login'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: '{"email":"test@test.com","password":"test"}',
    ).timeout(Duration(seconds: 10));
    
    print('Login Endpoint Status: ${loginResponse.statusCode}');
    if (loginResponse.statusCode == 400 || loginResponse.statusCode == 401) {
      print('✅ Login Endpoint: WORKING (Expected error for invalid credentials)');
    } else {
      print('Login Response: ${loginResponse.body}');
    }
  } catch (e) {
    print('❌ Login Endpoint: ERROR - $e');
  }
}

