const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'backend', 'src', 'api', 'v1');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix imports
    content = content.replace(
        /import\s+\{\s*classStudents\s*\}\s+from\s+'@\/db\/schema\/students';?/g,
        "import { people, studentProfiles, classStudents } from '@/db/schema';"
    );
    content = content.replace(
        /import\s+\{\s*students\s*\}\s+from\s+'@\/db\/schema\/students';?/g,
        "import { people, studentProfiles } from '@/db/schema';"
    );
    content = content.replace(
        /import\s+\{\s*students\s*,\s*classStudents\s*\}\s+from\s+'@\/db\/schema\/students';?/g,
        "import { people, studentProfiles, classStudents } from '@/db/schema';"
    );
    
    // Sometimes there are double imports if they were separated
    content = content.replace(
        /import \{ people, studentProfiles, classStudents \} from '@\/db\/schema';\nimport \{ people, studentProfiles \} from '@\/db\/schema';/g,
        "import { people, studentProfiles, classStudents } from '@/db/schema';"
    );

    // Replace usages in queries
    // classStudents.studentId -> classStudents.studentProfileId
    content = content.replace(/classStudents\.studentId/g, 'classStudents.studentProfileId');
    
    // students.id -> studentProfiles.id (or people.id depending on context, usually profile)
    // Actually, let's just make it studentProfiles.id for joins
    content = content.replace(/students\.id/g, 'studentProfiles.id');
    
    // students.name -> people.fullName
    content = content.replace(/students\.name/g, 'people.fullName');
    
    // students.nis -> studentProfiles.nis
    content = content.replace(/students\.nis/g, 'studentProfiles.nis');
    
    // students.gender -> people.gender
    content = content.replace(/students\.gender/g, 'people.gender');

    // Replace leftJoin(students, eq(classStudents.studentId, students.id))
    // With leftJoin(studentProfiles, eq(classStudents.studentProfileId, studentProfiles.id)).leftJoin(people, eq(studentProfiles.personId, people.id))
    content = content.replace(
        /\.leftJoin\(\s*students\s*,\s*eq\(\s*classStudents\.studentProfileId\s*,\s*studentProfiles\.id\s*\)\s*\)/g,
        ".leftJoin(studentProfiles, eq(classStudents.studentProfileId, studentProfiles.id)).leftJoin(people, eq(studentProfiles.personId, people.id))"
    );
    
    // Also innerJoin
    content = content.replace(
        /\.innerJoin\(\s*students\s*,\s*eq\(\s*classStudents\.studentProfileId\s*,\s*studentProfiles\.id\s*\)\s*\)/g,
        ".innerJoin(studentProfiles, eq(classStudents.studentProfileId, studentProfiles.id)).innerJoin(people, eq(studentProfiles.personId, people.id))"
    );

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

walk(targetDir);
