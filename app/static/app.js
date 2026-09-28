async function loadDashboard() {
    try {
        const devicesResponse = await fetch("/devices");
        const devices = await devicesResponse.json();

        const analyticsResponse = await fetch("/analytics");
        const analytics = await analyticsResponse.json();

        updateSummary(analytics);
        renderDevices(devices);

    } catch (error) {
        console.error("Failed to load dashboard:", error);
    }
}


function updateSummary(data) {
    document.getElementById("totalDevices").textContent =
        data.total_devices;

    document.getElementById("activeDevices").textContent =
        data.active_devices;

    document.getElementById("inactiveDevices").textContent =
        data.inactive_devices;

    document.getElementById("totalPower").textContent =
        data.total_power_consumption_watts;
}


function renderDevices(devices) {
    const grid = document.getElementById("deviceGrid");

    grid.innerHTML = "";

    devices.forEach(device => {

        const card = document.createElement("div");
        card.className = "device-card";

        const statusClass = device.status ? "online" : "offline";
        const statusText = device.status ? "ON" : "OFF";

        card.innerHTML = `
            <div class="device-header">
                <h3>${device.name}</h3>
                <span class="${statusClass}">
                    ${statusText}
                </span>
            </div>

            <p class="device-location">
                ${device.location}
            </p>

            <div class="device-info">
                <span>Brightness</span>
                <strong>${device.brightness}%</strong>
            </div>

            <div class="device-info">
                <span>Power</span>
                <strong>${device.power_watts} W</strong>
            </div>

            <div class="device-controls">

                <label>
                    Brightness
                </label>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value="${device.brightness}"
                    onchange="changeBrightness(
                        ${device.id},
                        this.value
                    )"
                >

                <button onclick="toggleDevice(${device.id})">
                    ${device.status ? "Turn Off" : "Turn On"}
                </button>

            </div>
        `;

        grid.appendChild(card);
    });
}


async function toggleDevice(deviceId) {
    try {
        await fetch(
            `/devices/${deviceId}/toggle`,
            { method: "PUT" }
        );

        await loadDashboard();

    } catch (error) {
        console.error("Failed to toggle device:", error);
    }
}


async function changeBrightness(deviceId, level) {
    try {
        await fetch(
            `/devices/${deviceId}/brightness/${level}`,
            { method: "PUT" }
        );

        await loadDashboard();

    } catch (error) {
        console.error(
            "Failed to update brightness:",
            error
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);
