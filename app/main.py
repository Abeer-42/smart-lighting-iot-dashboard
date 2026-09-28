from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="Smart Lighting IoT API",
    description="API for monitoring and controlling smart LED lighting devices.",
    version="1.0.0"
)


class LightDevice(BaseModel):
    id: int
    name: str
    location: str
    status: bool
    brightness: int
    power_watts: float


devices = [
    {
        "id": 1,
        "name": "LED-001",
        "location": "Zone A",
        "status": True,
        "brightness": 80,
        "power_watts": 42.5
    },
    {
        "id": 2,
        "name": "LED-002",
        "location": "Zone B",
        "status": True,
        "brightness": 65,
        "power_watts": 35.2
    },
    {
        "id": 3,
        "name": "LED-003",
        "location": "Zone C",
        "status": False,
        "brightness": 0,
        "power_watts": 0
    }
]


@app.get("/")
def home():
    return {
        "system": "Smart Lighting IoT Platform",
        "status": "online",
        "timestamp": datetime.now()
    }


@app.get("/devices")
def get_devices():
    return devices


@app.get("/devices/{device_id}")
def get_device(device_id: int):
    for device in devices:
        if device["id"] == device_id:
            return device

    return {"error": "Device not found"}


@app.put("/devices/{device_id}/toggle")
def toggle_device(device_id: int):
    for device in devices:
        if device["id"] == device_id:
            device["status"] = not device["status"]

            if not device["status"]:
                device["brightness"] = 0
                device["power_watts"] = 0

            return {
                "message": "Device status updated",
                "device": device
            }

    return {"error": "Device not found"}


@app.put("/devices/{device_id}/brightness/{level}")
def set_brightness(device_id: int, level: int):

    if level < 0 or level > 100:
        return {"error": "Brightness must be between 0 and 100"}

    for device in devices:
        if device["id"] == device_id:

            device["brightness"] = level
            device["status"] = level > 0

            # Simulated power consumption
            device["power_watts"] = round(level * 0.53, 2)

            return {
                "message": "Brightness updated",
                "device": device
            }

    return {"error": "Device not found"}


@app.get("/analytics")
def analytics():

    active_devices = sum(1 for d in devices if d["status"])
    total_power = sum(d["power_watts"] for d in devices)

    return {
        "total_devices": len(devices),
        "active_devices": active_devices,
        "inactive_devices": len(devices) - active_devices,
        "total_power_consumption_watts": round(total_power, 2),
        "timestamp": datetime.now()
    }
