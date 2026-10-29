import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = "http://localhost:5000";

test("GET /api/applications returns 200", async () => {
  const response = await fetch(`${baseUrl}/api/applications`);

  assert.equal(response.status, 200);

  const body = await response.json();

  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
});

test("GET unknown route returns 404", async () => {
  const response = await fetch(`${baseUrl}/api/unknown`);

  assert.equal(response.status, 404);

  const body = await response.json();

  assert.equal(body.success, false);
  assert.ok(body.message);
  assert.ok(body.errors);
});

test("POST without required fields returns 400", async () => {
  const response = await fetch(`${baseUrl}/api/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  assert.equal(response.status, 400);

  const body = await response.json();

  assert.equal(body.success, false);
  assert.ok(body.errors.company);
  assert.ok(body.errors.role);
});