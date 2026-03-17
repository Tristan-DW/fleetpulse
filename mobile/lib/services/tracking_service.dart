import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/vehicle.dart';

class TrackingService {
  static const String _wsUrl = 'ws://localhost:3000/ws';
  WebSocketChannel? _channel;
  final _controller = StreamController<Vehicle>.broadcast();

  Stream<Vehicle> get stream => _controller.stream;

  void connect() {
    _channel = WebSocketChannel.connect(Uri.parse(_wsUrl));
    _channel!.stream.listen(
      (data) {
        final json = jsonDecode(data as String);
        _controller.add(Vehicle.fromJson(json));
      },
      onError: (e) => print('WS error: $e'),
    );
  }

  void disconnect() {
    _channel?.sink.close();
    _controller.close();
  }
}
