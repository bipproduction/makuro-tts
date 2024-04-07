import mqtt from "mqtt";

declare global {
    var mqtt_client: undefined | mqtt.MqttClient
}

const mqtt_client = globalThis.mqtt_client ?? mqtt.connect("wss://io.wibudev.com");

export default mqtt_client