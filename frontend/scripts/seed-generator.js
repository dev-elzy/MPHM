/* eslint-disable */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Copy PBKDF2 hash algorithm implementation in pure Node compatible ES
const ITERATIONS = 10000;
const KEY_LEN = 32;

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LEN, 'sha256', (err, derivedKey) => {
      if (err) return reject(err);
      const saltHex = bufferToHex(salt);
      const hashHex = bufferToHex(derivedKey);
      resolve(`$pbkdf2$SHA-256$${ITERATIONS}$${saltHex}$${hashHex}`);
    });
  });
}

// Generate standard UUIDs
function uuid() {
  return crypto.randomUUID();
}

async function main() {
  console.log('Generating seed.sql...');
  
  // 1. Password hashing for default super admin
  const adminPasswordHash = await hashPassword('password123');
  console.log(`Generated default admin password hash: ${adminPasswordHash}`);

  // System IDs
  const superAdminRoleId = 'super_admin';
  const adminRoleId = 'admin';
  const operatorRoleId = 'operator';
  const mustahiqRoleId = 'mustahiq';
  const mudirRoleId = 'mudir';

  const defaultAdminId = uuid();
  const defaultInstitutionId = 'default';

  let sql = `-- MPHM Default Seed Data
-- Database: Cloudflare D1 / SQLite

-- 1. Insert System Roles
INSERT OR IGNORE INTO roles (id, name, display_name, description, is_system) VALUES
('${superAdminRoleId}', 'super_admin', 'Super Admin', 'Akses penuh terhadap seluruh sistem.', 1),
('${adminRoleId}', 'admin', 'Admin', 'Mengelola seluruh aktivitas akademik.', 1),
('${operatorRoleId}', 'operator', 'Operator', 'Membantu proses administrasi akademik.', 1),
('${mustahiqRoleId}', 'mustahiq', 'Mustahiq / Wali Kelas', 'Mustahiq pengampu satu kelas.', 1),
('${mudirRoleId}', 'mudir', 'Mudir / Kepala Madrasah', 'Monitoring progress akademik.', 1);

-- 2. Insert Default Super Admin User (Password: password123)
INSERT OR IGNORE INTO users (id, institution_id, name, email, password_hash, role, role_id, status) VALUES
('${defaultAdminId}', '${defaultInstitutionId}', 'Super Admin MPHM', 'admin@mphm.com', '${adminPasswordHash}', 'super_admin', '${superAdminRoleId}', 'active');

-- 3. Define Standard Permissions
`;

  const modules = [
    'auth',
    'academic_year',
    'semester',
    'curriculum',
    'subject',
    'class',
    'student',
    'user',
    'score',
    'attendance',
    'akhlaq',
    'report',
    'monitoring',
    'audit',
    'recycle_bin'
  ];

  const actions = [
    'view',
    'create',
    'update',
    'delete',
    'restore',
    'import',
    'export',
    'finalize',
    'unlock',
    'clone'
  ];

  const permissionList = [];

  // Generate Permissions inserts
  modules.forEach((mod) => {
    actions.forEach((act) => {
      const permName = `${mod}:${act}`;
      const permId = uuid();
      permissionList.push({ id: permId, name: permName, module: mod, action: act });
      sql += `INSERT OR IGNORE INTO permissions (id, name, module, action, description) VALUES ('${permId}', '${permName}', '${mod}', '${act}', 'Permission to ${act} in ${mod} module.');\n`;
    });
  });

  sql += '\n-- 4. Map Permissions to System Roles\n';

  // Super Admin gets ALL permissions
  permissionList.forEach((perm) => {
    sql += `INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES ('${uuid()}', '${superAdminRoleId}', '${perm.id}');\n`;
  });

  // Admin gets almost all permissions except auditing/restore global system setups
  permissionList.forEach((perm) => {
    if (perm.module !== 'audit') {
      sql += `INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES ('${uuid()}', '${adminRoleId}', '${perm.id}');\n`;
    }
  });

  // Mustahiq (wali kelas) gets dashboard, classes view, scores write, attendance, and akhlaq
  permissionList.forEach((perm) => {
    const isMustahiqPerm = 
      (perm.module === 'score' && ['view', 'update', 'finalize'].includes(perm.action)) ||
      (perm.module === 'attendance' && ['view', 'create', 'update', 'delete'].includes(perm.action)) ||
      (perm.module === 'akhlaq' && ['view', 'create', 'update', 'delete'].includes(perm.action)) ||
      (perm.module === 'class' && ['view'].includes(perm.action)) ||
      (perm.module === 'student' && ['view'].includes(perm.action)) ||
      (perm.module === 'report' && ['view'].includes(perm.action));
      
    if (isMustahiqPerm) {
      sql += `INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES ('${uuid()}', '${mustahiqRoleId}', '${perm.id}');\n`;
    }
  });

  // Mudir gets viewing/monitoring permissions only
  permissionList.forEach((perm) => {
    if (perm.action === 'view' || perm.module === 'monitoring') {
      sql += `INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES ('${uuid()}', '${mudirRoleId}', '${perm.id}');\n`;
    }
  });

  const outputPath = path.join(__dirname, 'seed.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`Successfully generated SQL seed file: ${outputPath}`);
}

main().catch(console.error);
