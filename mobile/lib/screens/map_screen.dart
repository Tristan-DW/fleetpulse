import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/tracking_service.dart';
import '../models/vehicle.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final TrackingService _tracking = TrackingService();
  final Map<int, Vehicle> _vehicles = {};

  @override
  void initState() {
    super.initState();
    _tracking.connect();
    _tracking.stream.listen((vehicle) {
      setState(() => _vehicles[vehicle.id] = vehicle);
    });
  }

  @override
  void dispose() {
    _tracking.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0d1117),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161b22),
        title: const Text('Fleet Map', style: TextStyle(color: Colors.white)),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Chip(
              label: Text(
                '${_vehicles.length} vehicles',
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
              backgroundColor: const Color(0xFF238636),
            ),
          ),
        ],
      ),
      body: FlutterMap(
        options: const MapOptions(
          initialCenter: LatLng(-26.2041, 28.0473),
          initialZoom: 11,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ),
          MarkerLayer(
            markers: _vehicles.values.map((v) => Marker(
              point: LatLng(v.lat, v.lng),
              width: 80,
              height: 40,
              child: Column(
                children: [
                  const Icon(Icons.directions_car, color: Color(0xFF6e40c9), size: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      color: const Color(0xFF161b22),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      v.plate,
                      style: const TextStyle(color: Colors.white, fontSize: 10),
                    ),
                  ),
                ],
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }
}
