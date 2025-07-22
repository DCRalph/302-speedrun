import { db } from "~/server/db";

/**
 * Set a user as admin by email
 */
export async function setUserAsAdmin(email: string) {
  try {
    const updatedUser = await db.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`✅ User ${email} has been set as ADMIN`);
    return updatedUser;
  } catch (error) {
    console.error(`❌ Failed to set user ${email} as admin:`, error);
    throw error;
  }
}

/**
 * Remove admin role from user by email
 */
export async function removeAdminRole(email: string) {
  try {
    const updatedUser = await db.user.update({
      where: { email },
      data: { role: "USER" },
    });

    console.log(`✅ Admin role removed from user ${email}`);
    return updatedUser;
  } catch (error) {
    console.error(`❌ Failed to remove admin role from user ${email}:`, error);
    throw error;
  }
}

/**
 * List all admin users
 */
export async function listAdminUsers() {
  try {
    const adminUsers = await db.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    console.log(`📋 Found ${adminUsers.length} admin users:`);
    adminUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    return adminUsers;
  } catch (error) {
    console.error("❌ Failed to list admin users:", error);
    throw error;
  }
} 