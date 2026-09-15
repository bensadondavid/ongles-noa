import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { GET, POST } from "../app/api/webhook/whatsapp/route.ts";

test("webhook signé : statuts corrélables sans données personnelles", async (t) => {
  const originalEnv = process.env;
  process.env = {
    ...process.env,
    META_APP_SECRET: "test-secret",
    WHATSAPP_VERIFY_TOKEN: "test-verify",
  };
  t.after(() => { process.env = originalEnv; });
  const info = t.mock.method(console, "info", () => {});
  const error = t.mock.method(console, "error", () => {});
  const request = (payload, valid = true) => new Request(
    "https://example.com/api/webhook/whatsapp",
    {
      method: "POST",
      body: payload,
      headers: {
        "x-hub-signature-256": `sha256=${createHmac("sha256", valid ? "test-secret" : "wrong").update(payload).digest("hex")}`,
      },
    },
  );
  const payload = JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{ changes: [{ value: {
      contacts: [{ name: "PRIVATE_CANARY" }],
      messages: [{ text: { body: "PRIVATE_CANARY" } }],
      statuses: ["sent", "delivered", "read", "failed"].map((status) => ({
        id: "wamid.TEST123=", status, recipient_id: "PRIVATE_CANARY",
        errors: [{ code: 131026, message: "PRIVATE_CANARY", error_data: { details: "PRIVATE_CANARY" } }],
      })),
    } }] }],
  });
  assert.equal((await POST(request(payload))).status, 200);
  const logs = [...info.mock.calls, ...error.mock.calls].map((call) => call.arguments[0]);
  assert.equal(logs.join("").includes("PRIVATE_CANARY"), false);
  const statuses = logs.filter((log) => log.startsWith("{")).map((log) => JSON.parse(log));
  assert.deepEqual(statuses.map((log) => log.status), ["sent", "delivered", "read", "failed"]);
  assert.ok(statuses.every((log) => log.messageId === "wamid.TEST123="));
  assert.deepEqual(statuses[3].errorCodes, [131026]);
  assert.equal(error.mock.callCount(), 1);

  const count = info.mock.callCount();
  assert.equal((await POST(request(payload, false))).status, 401);
  assert.equal(info.mock.callCount(), count);
  assert.equal((await POST(request("{"))).status, 400);
  for (const event of [null, {}, { object: "other" }, { object: "whatsapp_business_account", entry: [null, { changes: [null, { value: { statuses: [null, { status: "unknown" }] } }] }] }]) {
    assert.equal((await POST(request(JSON.stringify(event)))).status, 200);
  }
  assert.equal(error.mock.callCount(), 1);
  const challenge = await GET(new Request("https://example.com/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=test-verify&hub.challenge=123"));
  assert.equal(challenge.status, 200);
  assert.equal(await challenge.text(), "123");
});
