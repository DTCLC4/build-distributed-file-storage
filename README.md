# 🧩 Distributed File Storage (TypeScript + Node.js)

A simple peer-to-peer (P2P) distributed file storage system built with **Node.js**, **TypeScript**, and **UDP sockets**.
Each node can store and share files across the network using a lightweight protocol.

---

## 🚀 Features

- Peer discovery and communication over UDP
- File storage and replication between nodes
- Metadata tracking and chunk storage
- Base64 encoding for binary data transfer (supports text and images)
- Simple logging and configuration per node
- Extendable P2P message handling (`PING`, `PONG`, `STORE`, etc.)

---

## 🏗️ SRS – Distributed File Storage (DFS)

<https://docs.google.com/document/d/1OK9CXjaDOxoh0WNMTpBYAAcbBHxZHNrsHWnXRzsv_B0/edit?hl=vi&tab=t.0>

---

## ⚙️ Installation

```bash
git clone https://github.com/dinhthi12/build-distributed-file-storage.git
cd build-distributed-file-storage

# Install dependencies
npm install

PORT=4001 STORAGE_PATH=./data/node-4001 npx ts-node src/index.ts
PORT=4002 STORAGE_PATH=./data/node-4002 npx ts-node src/index.ts

