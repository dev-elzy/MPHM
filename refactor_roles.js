const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.wrangler') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        callback(path.join(dir, f));
      }
    }
  });
}

function refactorRoles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Pattern 1: Array of roles like ['super_admin', 'admin', 'operator']
  content = content.replace(/\['super_admin',\s*'admin',\s*'operator',\s*'sekretariat'\]/g, "['sekretariat']");
  content = content.replace(/\['super_admin',\s*'admin',\s*'operator'\]/g, "['sekretariat']");
  content = content.replace(/\['super_admin',\s*'admin'\]/g, "['sekretariat']");
  content = content.replace(/\['admin',\s*'super_admin',\s*'operator',\s*'sekretariat'\]/g, "['sekretariat']");
  content = content.replace(/\['sekretariat',\s*'super_admin',\s*'admin',\s*'operator'\]/g, "['sekretariat']");
  content = content.replace(/\['mustahiq',\s*'teacher',\s*'ustadz',\s*'sekretariat',\s*'super_admin',\s*'admin',\s*'operator'\]/g, "['mustahiq', 'teacher', 'ustadz', 'sekretariat']");
  content = content.replace(/\['super_admin',\s*'admin',\s*'mudir',\s*'operator',\s*'mustahiq',\s*'teacher',\s*'ustadz'\]/g, "['sekretariat', 'mudir', 'mustahiq', 'teacher', 'ustadz']");
  content = content.replace(/\['super_admin',\s*'admin',\s*'operator',\s*'mudir',\s*'mufatish'\]/g, "['sekretariat', 'mudir', 'mufatish']");
  content = content.replace(/\['super_admin',\s*'admin',\s*'operator',\s*'mustahiq',\s*'mudir',\s*'mufatish'\]/g, "['sekretariat', 'mustahiq', 'mudir', 'mufatish']");

  // Pattern 2: Zod enums
  content = content.replace(/z\.enum\(\['super_admin',\s*'admin',\s*'operator',\s*'mustahiq',\s*'mudir',\s*'mufatish',\s*'security'\]\)/g, "z.enum(['sekretariat', 'mustahiq', 'mudir', 'mufatish', 'security'])");
  content = content.replace(/z\.enum\(\['admin',\s*'operator',\s*'mustahiq',\s*'mudir'\]\)/g, "z.enum(['sekretariat', 'mustahiq', 'mudir'])");

  // Types
  content = content.replace(/'super_admin' \| 'admin' \| 'operator' \| 'mustahiq' \| 'mudir' \| 'mufatish' \| 'security'/g, "'sekretariat' | 'mustahiq' | 'mudir' | 'mufatish' | 'security'");

  // Specific lines in frontend hooks/middleware
  if (filePath.includes('useAuthSession.ts')) {
    content = content.replace(/role: 'super_admin' \| 'admin' \| 'operator' \| 'mustahiq' \| 'mudir' \| string;/g, "role: 'sekretariat' | 'mustahiq' | 'mudir' | string;");
    content = content.replace(/const isSekretariat = role === 'sekretariat' \|\| role === 'super_admin' \|\| role === 'admin' \|\| role === 'operator';/g, "const isSekretariat = role === 'sekretariat';");
  }

  if (filePath.includes('middleware.ts')) {
    content = content.replace(/const isSekretariat = \['sekretariat', 'super_admin', 'admin', 'operator'\].includes\(userRole\);/g, "const isSekretariat = userRole === 'sekretariat';");
  }

  if (filePath.includes('Sidebar.tsx')) {
    content = content.replace(/if \(\['sekretariat', 'super_admin', 'admin', 'operator'\].includes\(roleLower\)\) return 'Sekretariat';/g, "if (roleLower === 'sekretariat') return 'Sekretariat';");
    content = content.replace(/if \(\['super_admin', 'admin', 'operator', 'sekretariat'\].includes\(ar\)\) {/g, "if (ar === 'sekretariat') {");
  }

  if (filePath.includes('academic.ts')) {
    content = content.replace(/SUPER_ADMIN: 'super_admin',/g, "");
    content = content.replace(/ADMIN: 'admin',/g, "");
    content = content.replace(/OPERATOR: 'operator',/g, "SEKRETARIAT: 'sekretariat',");
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

console.log("Refactoring backend...");
walkDir(path.join(__dirname, 'backend', 'src'), refactorRoles);

console.log("Refactoring frontend...");
walkDir(path.join(__dirname, 'frontend', 'src'), refactorRoles);
