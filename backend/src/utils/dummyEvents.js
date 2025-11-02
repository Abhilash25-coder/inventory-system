import { Kafka } from "kafkajs";
import { config } from "../config.js";

const kafkaConfig = {
  clientId: "inventory-client",
  brokers: [config.KAFKA_BROKER],
  connectionTimeout: 30000, // 30s instead of default 10s
};

// Only add SASL if credentials are provided (for cloud/remote brokers)
if (config.KAFKA_USERNAME && config.KAFKA_PASSWORD) {
  kafkaConfig.ssl = true;
  kafkaConfig.sasl = {
    mechanism: config.KAFKA_SASL_MECHANISM,
    username: config.KAFKA_USERNAME,
    password: config.KAFKA_PASSWORD,
  };
}

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();
const products = ["PRD001", "PRD002", "PRD003", "PRD004", "PRD005", "PRD006", "PRD007", "PRD008", "PRD009", "PRD010"];

export async function produceDummyEvents() {
  await producer.connect();

  const events = [
    { product_id: "PRD001", event_type: "purchase", quantity: 50, unit_price: 100, timestamp: new Date().toISOString() },
    { product_id: "PRD001", event_type: "purchase", quantity: 30, unit_price: 110, timestamp: new Date().toISOString() },
    { product_id: "PRD001", event_type: "sale", quantity: 40, timestamp: new Date().toISOString() },
  ];

  for (const e of events) {
    await producer.send({
      topic: config.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(e) }],
    });
  }

  await producer.disconnect();
  console.log("Dummy Kafka events produced");
}

let intervalId = null;
let isRunning = false;

export async function startAutoProducer() {
  if (isRunning) return; // already running
  isRunning = true;
  await producer.connect();
  console.log("Auto producer started (sending events every 10s)");


  intervalId = setInterval(async () => {
    if (!isRunning) return; // prevent sending after stop
    const product = products[Math.floor(Math.random() * products.length)];
    const eventType = Math.random() > 0.5 ? "purchase" : "sale";

    const event = {
      product_id: product,
      event_type: eventType,
      quantity: Math.floor(Math.random() * 10) + 1,
      ...(eventType === "purchase" && { unit_price: 90 + Math.random() * 10 }),
      timestamp: new Date().toISOString(),
    };

    try {
      await producer.send({
        topic: config.KAFKA_TOPIC,
        messages: [{ value: JSON.stringify(event) }],
      });
      console.log("Event sent:", event);
    } catch (err) {
      console.error("Error sending event:", err.message);
    }
  }, 10000);
}

export async function stopAutoProducer() {
  if (!isRunning) return;
  isRunning = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  await producer.disconnect().catch(() => {});
  console.log("Auto producer stopped");
}

