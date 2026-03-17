class Vehicle {
  final int id;
  final String plate;
  final double lat;
  final double lng;
  final double? speed;
  final String ts;

  const Vehicle({
    required this.id,
    required this.plate,
    required this.lat,
    required this.lng,
    this.speed,
    required this.ts,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) => Vehicle(
    id: json['vehicle_id'] as int,
    plate: json['plate'] as String? ?? 'V-${json['vehicle_id']}',
    lat: (json['lat'] as num).toDouble(),
    lng: (json['lng'] as num).toDouble(),
    speed: (json['speed'] as num?)?.toDouble(),
    ts: json['ts'] as String,
  );
}
