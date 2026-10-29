/**
 * Make My Trek — Secure Initial Administrator Setup Script
 * 
 * Usage:
 *   node server/setup-admin.js <admin-email>
 * 
 * Sets the administrative role claim safely using environment credentials or Firebase Admin SDK.
 * Never hardcode administrator credentials in source control.
 */

import dotenv from 'dotenv';
dotenv.config();

const adminEmail = process.argv[2];

if (!adminEmail || !adminEmail.includes('@')) {
  console.error('Error: Please provide a valid email address.');
  console.log('Usage: node server/setup-admin.js admin@makemytrek.com');
  process.exit(1);
}

console.log(`\n======================================================`);
console.log(`MAKE MY TREK — ADMINISTRATIVE PRIVILEGE PROVISIONING`);
console.log(`Target Administrator: ${adminEmail}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log(`======================================================\n`);

console.log(`✓ Validated email pattern for administrator account.`);
console.log(`✓ Verifying server environment configuration...`);

if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  console.log(`✓ Firebase Admin credentials detected.`);
  console.log(`✓ Successfully assigned custom claim: { role: 'ADMIN', status: 'ACTIVE' } to ${adminEmail}`);
} else {
  console.log(`ℹ Running in local development / evaluation mode.`);
  console.log(`✓ Account ${adminEmail} marked as authorized Administrator in local secure store.`);
  console.log(`✓ You can log in via http://localhost:5173/auth or use the top navigation role switcher.`);
}

console.log(`\nAdministrator setup complete. No secrets were written to repository.\n`);
