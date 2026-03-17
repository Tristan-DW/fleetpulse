import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  final String baseUrl;
  ApiService({this.baseUrl = 'http://localhost:3000'});

  Future<String?> get _token async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<Map<String, String>> get _headers async {
    final token = await _token;
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer \$token',
    };
  }

  Future<T> _request<T>(
    String method,
    String path, {
    Map<String, dynamic>? body,
    T Function(dynamic)? parse,
  }) async {
    final uri = Uri.parse('\$baseUrl\$path');
    final headers = await _headers;

    final response = switch (method) {
      'GET'    => await http.get(uri, headers: headers),
      'POST'   => await http.post(uri, headers: headers, body: jsonEncode(body)),
      'PUT'    => await http.put(uri, headers: headers, body: jsonEncode(body)),
      'DELETE' => await http.delete(uri, headers: headers),
      _        => throw Exception('Unknown method: \$method'),
    };

    if (response.statusCode >= 400) {
      final err = jsonDecode(response.body);
      throw Exception(err['message'] ?? 'Request failed: HTTP \${response.statusCode}');
    }

    final data = jsonDecode(response.body);
    return parse != null ? parse(data) : data as T;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final data = await _request<Map<String, dynamic>>(
      'POST', '/auth/login',
      body: {'email': email, 'password': password},
    );
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', data['token'] as String);
    return data;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  Future<List<dynamic>> getVehicles() =>
      _request<List<dynamic>>('GET', '/vehicles');

  Future<Map<String, dynamic>> getVehicleLocation(int id) =>
      _request<Map<String, dynamic>>('GET', '/vehicles/\$id/location');

  Future<List<dynamic>> getDrivers() =>
      _request<List<dynamic>>('GET', '/drivers');

  Future<Map<String, dynamic>> getAnalytics() =>
      _request<Map<String, dynamic>>('GET', '/analytics/utilization');

  Future<Map<String, dynamic>> health() =>
      _request<Map<String, dynamic>>('GET', '/health');
}
