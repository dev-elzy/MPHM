const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filePath}, does not exist`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [regex, repl] of replacements) {
        content = content.replace(regex, repl);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const basePath = path.join(__dirname, 'backend', 'src', 'api', 'v1');

// 1. Cron Cleanup
replaceInFile(path.join(basePath, 'cron', 'cleanup', 'route.ts'), [
    [/\.delete\(students\)/g, '.delete(studentProfiles)'],
    [/isNotNull\(students\.deletedAt\)/g, 'isNotNull(studentProfiles.deletedAt)'],
    [/lt\(students\.deletedAt/g, 'lt(studentProfiles.deletedAt'],
    [/import \{ people, studentProfiles \} from '@\/db\/schema';/, "import { people, studentProfiles } from '@/db/schema';"]
]);

// 2. Dashboard Admin
replaceInFile(path.join(basePath, 'dashboard', 'admin', 'route.ts'), [
    [/\.from\(students\)/g, '.from(studentProfiles)'],
    [/notDeleted\(students\)/g, 'notDeleted(studentProfiles)'],
    [/eq\(students\.status/g, 'eq(studentProfiles.status']
]);

// 3. Recycle Bin
replaceInFile(path.join(basePath, 'recycle-bin', 'route.ts'), [
    [/\.from\(students\)/g, '.from(studentProfiles).innerJoin(people, eq(people.id, studentProfiles.personId))'],
    [/students\.deletedAt/g, 'studentProfiles.deletedAt'],
    [/students\.name/g, 'people.fullName'],
    [/students\.id/g, 'studentProfiles.id'],
    [/\.update\(students\)/g, '.update(studentProfiles)'],
    [/eq\(students\.id, id\)/g, 'eq(studentProfiles.id, id)']
]);

// 4. Guardian Portal
replaceInFile(path.join(basePath, 'guardian', 'portal', 'route.ts'), [
    [/\.leftJoin\(students, eq\(classStudents\.studentProfileId, students\.id\)\)/g, '.leftJoin(studentProfiles, eq(classStudents.studentProfileId, studentProfiles.id)).leftJoin(people, eq(people.id, studentProfiles.personId))'],
    [/\.innerJoin\(students, eq\(akhlaq\.studentId, students\.id\)\)/g, '.innerJoin(studentProfiles, eq(akhlaq.studentId, studentProfiles.id)).innerJoin(people, eq(people.id, studentProfiles.personId))'],
    [/students\.name/g, 'people.fullName'],
    [/students\.nis/g, 'studentProfiles.nis'],
    [/students\.gender/g, 'people.gender'],
    [/students\.id/g, 'studentProfiles.id']
]);

// 5. Media Upload
replaceInFile(path.join(basePath, 'media', 'upload', 'route.ts'), [
    [/if \(\!file \|\| \!\(file instanceof File\)\)/g, 'if (!file || typeof file !== "object" || !("name" in file))']
]);

console.log("Done running final fixes");
