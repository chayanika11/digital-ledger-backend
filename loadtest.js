const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const autocannon = require("autocannon");

process.env.JWT_SECRET = "loadtest_jwt_secret_key_12345";

async function runLoadTest() {
    console.log("🚀 Starting In-Memory MongoDB Server...");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;

    const connectToDB = require("./src/config/db");
    await connectToDB();

    const app = require("./src/app");
    const PORT = 4005;
    const server = app.listen(PORT, () => {
        console.log(`📡 Benchmark server listening on http://localhost:${PORT}`);
    });

    // 1. Seed data for authenticated load testing
    const userModel = require("./src/models/user.model");
    const accountModel = require("./src/models/account.model");
    const transactionModel = require("./src/models/transaction.model");
    const ledgerModel = require("./src/models/ledger.model");
    const jwt = require("jsonwebtoken");

    console.log("🌱 Seeding benchmark data...");
    const user = await userModel.create({
        name: "LoadTester",
        email: "tester@loadtest.com",
        password: "password123"
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const account1 = await accountModel.create({
        user: user._id,
        accountNumber: "ACC10001",
        balance: 1000000,
        currency: "USD",
        status: "ACTIVE"
    });

    const account2 = await accountModel.create({
        user: user._id,
        accountNumber: "ACC10002",
        balance: 500000,
        currency: "USD",
        status: "ACTIVE"
    });

    const initialTx = await transactionModel.create({
        fromAccount: account1._id,
        toAccount: account2._id,
        amount: 1000,
        idempotencyKey: "initial-seed-tx-001",
        status: "COMPLETED"
    });

    await ledgerModel.create({
        account: account1._id,
        amount: 1000,
        transaction: initialTx._id,
        type: "CREDIT"
    });

    await ledgerModel.create({
        account: account2._id,
        amount: 1000,
        transaction: initialTx._id,
        type: "CREDIT"
    });

    console.log("✅ Benchmark data seeded successfully!\n");

    // Benchmark 1: Healthcheck GET /
    console.log("📊 Running Benchmark 1: GET / (Healthcheck)...");
    const res1 = await autocannon({
        url: `http://localhost:${PORT}/`,
        connections: 10,
        duration: 5
    });

    // Benchmark 2: Authenticated GET /api/accounts
    console.log("📊 Running Benchmark 2: GET /api/accounts (Authenticated DB Fetch)...");
    const res2 = await autocannon({
        url: `http://localhost:${PORT}/api/accounts`,
        connections: 10,
        duration: 5,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Benchmark 3: Idempotent POST /api/transactions
    console.log("📊 Running Benchmark 3: POST /api/transactions (Ledger Transfer)...");
    let txCounter = 0;
    const res3 = await autocannon({
        url: `http://localhost:${PORT}/api/transactions`,
        connections: 5,
        duration: 5,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        requests: [
            {
                setupRequest: (req) => {
                    txCounter++;
                    req.body = JSON.stringify({
                        fromAccount: account1._id.toString(),
                        toAccount: account2._id.toString(),
                        amount: 1,
                        idempotencyKey: `loadtest-key-${txCounter}-${Date.now()}-${Math.random()}`
                    });
                    return req;
                }
            }
        ]
    });

    // Print summary
    console.log("\n=======================================================");
    console.log("               🔥 LOAD TEST RESULTS SUMMARY 🔥          ");
    console.log("=======================================================\n");

    console.log("1. GET / (Healthcheck):");
    console.log(`   • Req/Sec (RPS):   ${res1.requests.average}`);
    console.log(`   • Latency Avg:     ${res1.latency.average} ms`);
    console.log(`   • Latency p50:     ${res1.latency.p50} ms`);
    console.log(`   • Latency p95:     ${res1.latency.p95} ms`);
    console.log(`   • Latency p99:     ${res1.latency.p99} ms\n`);

    console.log("2. GET /api/accounts (Auth & DB Fetch):");
    console.log(`   • Req/Sec (RPS):   ${res2.requests.average}`);
    console.log(`   • Latency Avg:     ${res2.latency.average} ms`);
    console.log(`   • Latency p50:     ${res2.latency.p50} ms`);
    console.log(`   • Latency p95:     ${res2.latency.p95} ms`);
    console.log(`   • Latency p99:     ${res2.latency.p99} ms\n`);

    console.log("3. POST /api/transactions (Full Ledger Transaction):");
    console.log(`   • Req/Sec (RPS):   ${res3.requests.average}`);
    console.log(`   • Latency Avg:     ${res3.latency.average} ms`);
    console.log(`   • Latency p50:     ${res3.latency.p50} ms`);
    console.log(`   • Latency p95:     ${res3.latency.p95} ms`);
    console.log(`   • Latency p99:     ${res3.latency.p99} ms\n`);

    console.log("=======================================================\n");

    // Cleanup
    server.close();
    await mongoose.connection.close();
    await mongoServer.stop();
    process.exit(0);
}

runLoadTest().catch(err => {
    console.error("Load test error:", err);
    process.exit(1);
});
