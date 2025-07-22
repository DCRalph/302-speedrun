#!/usr/bin/env tsx

import { setUserAsAdmin, listAdminUsers } from "../src/server/admin-utils";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("❌ Please provide an email address");
    console.log("Usage: tsx scripts/set-admin.ts <email@example.com>");
    process.exit(1);
  }

  try {
    console.log(`Setting ${email} as admin...`);
    await setUserAsAdmin(email);

    console.log("\n📋 Current admin users:");
    await listAdminUsers();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

main().catch(console.error); 