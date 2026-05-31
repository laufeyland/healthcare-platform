from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
import json
import asyncio
import psutil

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        # Get the first offered subprotocol (e.g., "access_token")
        offered = self.scope.get("subprotocols", [])
        chosen_proto = offered[0] if offered else None

        if user and not isinstance(user, AnonymousUser) and user.is_authenticated:
            self.user_group_name = f"user_{user.id}"
            await self.channel_layer.group_add(self.user_group_name, self.channel_name)
            # Echo back the subprotocol so the browser handshake succeeds
            await self.accept(subprotocol=chosen_proto)
            print(f"✅ WebSocket accepted for {user} with subprotocol: {chosen_proto}")
        else:
            print("⛔ Unauthorized—closing connection")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
        print(f"🧪 Disconnect with code: {close_code}")

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        offered = self.scope.get("subprotocols", [])
        chosen_proto = offered[0] if offered else None

        if user and not isinstance(user, AnonymousUser) and user.is_authenticated:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept(subprotocol=chosen_proto)
            print(f"✅ Chat WebSocket accepted for {user} in room: {self.room_name}")
        else:
            print("⛔ Unauthorized—closing connection")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        print(f"🧪 Chat disconnect with code: {close_code}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_id = self.scope["user"].id

        # We can add DB saving logic here via sync_to_async if needed

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id
        }))

class PerformanceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        offered = self.scope.get("subprotocols", [])
        chosen_proto = offered[0] if offered else None

        if user and not isinstance(user, AnonymousUser) and user.is_authenticated:
            # Optionally check if user.role == 'admin' if role is loaded
            await self.accept(subprotocol=chosen_proto)
            print(f"✅ Performance WebSocket accepted for {user}")
            # Initialize psutil cpu percent
            psutil.cpu_percent(interval=None)
            self.task = asyncio.create_task(self.send_performance_data())
        else:
            print("⛔ Unauthorized—closing connection")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'task'):
            self.task.cancel()
        print(f"🧪 Performance disconnect with code: {close_code}")

    async def send_performance_data(self):
        try:
            while True:
                await asyncio.sleep(2) # Send updates every 2 seconds
                cpu_usage = psutil.cpu_percent(interval=None)
                memory_info = psutil.virtual_memory()
                disk_info = psutil.disk_usage('/')

                data = {
                    "cpu_usage": cpu_usage,
                    "memory_usage": memory_info.percent,
                    "memory_total_gb": round(memory_info.total / (1024 ** 3), 2),
                    "memory_used_gb": round(memory_info.used / (1024 ** 3), 2),
                    "disk_usage": disk_info.percent,
                    "disk_total_gb": round(disk_info.total / (1024 ** 3), 2),
                    "disk_used_gb": round(disk_info.used / (1024 ** 3), 2),
                }
                await self.send(text_data=json.dumps(data))
        except asyncio.CancelledError:
            pass
