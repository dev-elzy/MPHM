import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { setHonoSessionResolver, verifySessionToken } from '@/lib/auth/session';

// Route Imports
import * as academicYears from '@/app/api/v1/academic-years/route';
import * as academicYearsId from '@/app/api/v1/academic-years/[id]/route';
import * as academicYearsIdClone from '@/app/api/v1/academic-years/[id]/clone/route';
import * as academicYearsIdWorkflow from '@/app/api/v1/academic-years/[id]/workflow/route';

import * as semesters from '@/app/api/v1/semesters/route';
import * as semestersId from '@/app/api/v1/semesters/[id]/route';
import * as semestersIdActivate from '@/app/api/v1/semesters/[id]/activate/route';

import * as classes from '@/app/api/v1/classes/route';
import * as classesId from '@/app/api/v1/classes/[id]/route';
import * as classesImport from '@/app/api/v1/classes/import/route';

import * as students from '@/app/api/v1/students/route';
import * as studentsId from '@/app/api/v1/students/[id]/route';
import * as studentsImport from '@/app/api/v1/students/import/route';
import * as studentsAchievements from '@/app/api/v1/students/achievements/route';
import * as studentsAchievementsId from '@/app/api/v1/students/achievements/[id]/route';

import * as subjects from '@/app/api/v1/subjects/route';
import * as subjectsId from '@/app/api/v1/subjects/[id]/route';
import * as subjectsImport from '@/app/api/v1/subjects/import/route';

import * as users from '@/app/api/v1/users/route';
import * as usersId from '@/app/api/v1/users/[id]/route';
import * as usersImport from '@/app/api/v1/users/import/route';

import * as scores from '@/app/api/v1/scores/route';
import * as scoreSessions from '@/app/api/v1/score-sessions/route';
import * as scoreSessionsId from '@/app/api/v1/score-sessions/[id]/route';
import * as scoreSessionsIdEntries from '@/app/api/v1/score-sessions/[id]/entries/route';
import * as scoreSessionsIdFinalize from '@/app/api/v1/score-sessions/[id]/finalize/route';

import * as attendance from '@/app/api/v1/attendance/route';
import * as akhlaq from '@/app/api/v1/akhlaq/route';

import * as violationsCategories from '@/app/api/v1/violations/categories/route';
import * as violationsIncidents from '@/app/api/v1/violations/incidents/route';
import * as violationsTypes from '@/app/api/v1/violations/types/route';
import * as violationsSeverities from '@/app/api/v1/violations/severities/route';

import * as notifications from '@/app/api/v1/notifications/route';
import * as notificationsSent from '@/app/api/v1/notifications/sent/route';

import * as auditLogs from '@/app/api/v1/audit-logs/route';
import * as recycleBin from '@/app/api/v1/recycle-bin/route';
import * as schedules from '@/app/api/v1/schedules/route';
import * as guardianPortal from '@/app/api/v1/guardian/portal/route';
import * as promotions from '@/app/api/v1/promotions/route';

import * as authLogin from '@/app/api/v1/auth/login/route';
import * as authLogout from '@/app/api/v1/auth/logout/route';
import * as authMe from '@/app/api/v1/auth/me/route';
import * as authProfile from '@/app/api/v1/auth/profile/route';

import * as academicClasses from '@/app/api/v1/academic/classes/route';
import * as academicEnrollments from '@/app/api/v1/academic/enrollments/route';
import * as academicPromote from '@/app/api/v1/academic/promote/route';

import * as dashboardAdmin from '@/app/api/v1/dashboard/admin/route';
import * as dashboardSecurity from '@/app/api/v1/dashboard/security/route';

import * as dataCenterProfileId from '@/app/api/v1/data-center/profile/[id]/route';
import * as dataCenterSearch from '@/app/api/v1/data-center/search/route';

import * as mediaUpload from '@/app/api/v1/media/upload/route';
import * as cronCleanup from '@/app/api/v1/cron/cleanup/route';

const app = new Hono<{ Bindings: { DB: D1Database } }>();

// CORS Setup
app.use('*', cors({
  origin: (origin) => {
    if (!origin || origin.startsWith('http://localhost') || origin === 'https://m.p3hm.my.id') {
      return origin;
    }
    return 'https://m.p3hm.my.id';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Global Context Bridge (Database & Session)
app.use('*', async (c, next) => {
  // Bind DB instance globally so getDb() helper can retrieve it
  (globalThis as any).DB = c.env.DB;
  
  // Bind session resolver hook
  setHonoSessionResolver(async () => {
    const cookie = getCookie(c, 'mphm_session');
    if (!cookie) return null;
    return verifySessionToken(cookie);
  });
  
  await next();
});

// Routing Helper Functions
async function route(c: any, handler: any) {
  const method = c.req.method;
  try {
    if (method === 'GET' && handler.GET) return handler.GET(c.req.raw);
    if (method === 'POST' && handler.POST) return handler.POST(c.req.raw);
    if (method === 'PUT' && handler.PUT) return handler.PUT(c.req.raw);
    if (method === 'DELETE' && handler.DELETE) return handler.DELETE(c.req.raw);
    if (method === 'PATCH' && handler.PATCH) return handler.PATCH(c.req.raw);
    return c.text('Method not allowed', 405);
  } catch (err: any) {
    console.error(`Route handler failed [${method}]:`, err);
    return c.text(err.message || 'Internal Server Error', 500);
  }
}

async function routeWithParams(c: any, handler: any, paramNames: string[]) {
  const method = c.req.method;
  try {
    const params: Record<string, string> = {};
    paramNames.forEach(name => {
      params[name] = c.req.param(name);
    });
    const context = { params };
    
    if (method === 'GET' && handler.GET) return handler.GET(c.req.raw, context);
    if (method === 'POST' && handler.POST) return handler.POST(c.req.raw, context);
    if (method === 'PUT' && handler.PUT) return handler.PUT(c.req.raw, context);
    if (method === 'DELETE' && handler.DELETE) return handler.DELETE(c.req.raw, context);
    if (method === 'PATCH' && handler.PATCH) return handler.PATCH(c.req.raw, context);
    return c.text('Method not allowed', 405);
  } catch (err: any) {
    console.error(`Route handler with params failed [${method}]:`, err);
    return c.text(err.message || 'Internal Server Error', 500);
  }
}

// REST Endpoints
app.get('/', (c) => c.text('MPHM Backend Worker is running!'));

app.all('/api/v1/academic-years', (c) => route(c, academicYears));
app.all('/api/v1/academic-years/:id', (c) => routeWithParams(c, academicYearsId, ['id']));
app.all('/api/v1/academic-years/:id/clone', (c) => routeWithParams(c, academicYearsIdClone, ['id']));
app.all('/api/v1/academic-years/:id/workflow', (c) => routeWithParams(c, academicYearsIdWorkflow, ['id']));

app.all('/api/v1/semesters', (c) => route(c, semesters));
app.all('/api/v1/semesters/:id', (c) => routeWithParams(c, semestersId, ['id']));
app.all('/api/v1/semesters/:id/activate', (c) => routeWithParams(c, semestersIdActivate, ['id']));

app.all('/api/v1/classes', (c) => route(c, classes));
app.all('/api/v1/classes/import', (c) => route(c, classesImport));
app.all('/api/v1/classes/:id', (c) => routeWithParams(c, classesId, ['id']));

app.all('/api/v1/students', (c) => route(c, students));
app.all('/api/v1/students/import', (c) => route(c, studentsImport));
app.all('/api/v1/students/achievements', (c) => route(c, studentsAchievements));
app.all('/api/v1/students/achievements/:id', (c) => routeWithParams(c, studentsAchievementsId, ['id']));
app.all('/api/v1/students/:id', (c) => routeWithParams(c, studentsId, ['id']));

app.all('/api/v1/subjects', (c) => route(c, subjects));
app.all('/api/v1/subjects/import', (c) => route(c, subjectsImport));
app.all('/api/v1/subjects/:id', (c) => routeWithParams(c, subjectsId, ['id']));

app.all('/api/v1/users', (c) => route(c, users));
app.all('/api/v1/users/import', (c) => route(c, usersImport));
app.all('/api/v1/users/:id', (c) => routeWithParams(c, usersId, ['id']));

app.all('/api/v1/scores', (c) => route(c, scores));
app.all('/api/v1/score-sessions', (c) => route(c, scoreSessions));
app.all('/api/v1/score-sessions/:id', (c) => routeWithParams(c, scoreSessionsId, ['id']));
app.all('/api/v1/score-sessions/:id/entries', (c) => routeWithParams(c, scoreSessionsIdEntries, ['id']));
app.all('/api/v1/score-sessions/:id/finalize', (c) => routeWithParams(c, scoreSessionsIdFinalize, ['id']));

app.all('/api/v1/attendance', (c) => route(c, attendance));
app.all('/api/v1/akhlaq', (c) => route(c, akhlaq));

app.all('/api/v1/violations/categories', (c) => route(c, violationsCategories));
app.all('/api/v1/violations/incidents', (c) => route(c, violationsIncidents));
app.all('/api/v1/violations/types', (c) => route(c, violationsTypes));
app.all('/api/v1/violations/severities', (c) => route(c, violationsSeverities));

app.all('/api/v1/notifications', (c) => route(c, notifications));
app.all('/api/v1/notifications/sent', (c) => route(c, notificationsSent));

app.all('/api/v1/audit-logs', (c) => route(c, auditLogs));
app.all('/api/v1/recycle-bin', (c) => route(c, recycleBin));
app.all('/api/v1/schedules', (c) => route(c, schedules));
app.all('/api/v1/guardian/portal', (c) => route(c, guardianPortal));
app.all('/api/v1/promotions', (c) => route(c, promotions));

app.all('/api/v1/auth/login', (c) => route(c, authLogin));
app.all('/api/v1/auth/logout', (c) => route(c, authLogout));
app.all('/api/v1/auth/me', (c) => route(c, authMe));
app.all('/api/v1/auth/profile', (c) => route(c, authProfile));

app.all('/api/v1/academic/classes', (c) => route(c, academicClasses));
app.all('/api/v1/academic/enrollments', (c) => route(c, academicEnrollments));
app.all('/api/v1/academic/promote', (c) => route(c, academicPromote));

app.all('/api/v1/dashboard/admin', (c) => route(c, dashboardAdmin));
app.all('/api/v1/dashboard/security', (c) => route(c, dashboardSecurity));

app.all('/api/v1/data-center/profile/:id', (c) => routeWithParams(c, dataCenterProfileId, ['id']));
app.all('/api/v1/data-center/search', (c) => route(c, dataCenterSearch));

app.all('/api/v1/media/upload', (c) => route(c, mediaUpload));
app.all('/api/v1/cron/cleanup', (c) => route(c, cronCleanup));

export default app;
