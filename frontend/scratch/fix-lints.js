const fs = require('fs');

function fixPromotionsRoute() {
  const file = 'src/app/api/v1/promotions/route.ts';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('promotionPeriods, promotionTransactions', 'promotionPeriods');
  c = c.replace('GET(req: Request)', 'GET(_req: Request)');
  c = c.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  c = c.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');
  fs.writeFileSync(file, c);
}

function fixSchedulesRoute() {
  const file = 'src/app/api/v1/schedules/route.ts';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  c = c.replace(/error\.message/g, 'error instanceof Error ? error.message : String(error)');
  fs.writeFileSync(file, c);
}

function fixPromosiPage() {
  const file = 'src/app/dashboard/akademik/promosi/page.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('ColumnDef<any>[]', 'ColumnDef<Record<string, unknown>>[]');
  fs.writeFileSync(file, c);
}

function fixJadwalPage() {
  const file = 'src/app/dashboard/akademik/jadwal/page.tsx';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace('const [selectedJenjang, setSelectedJenjang]', 'const [selectedJenjang, _setSelectedJenjang]');
  c = c.replace('const [selectedTingkat, setSelectedTingkat]', 'const [selectedTingkat, _setSelectedTingkat]');
  fs.writeFileSync(file, c);
}

function fixAdvancedModules() {
  const file = 'src/db/seed/advanced-modules.ts';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace("import { classes } from '../schema/classes';\r\n", "");
  c = c.replace("import { classes } from '../schema/classes';\n", "");
  fs.writeFileSync(file, c);
}

try { fixPromotionsRoute(); } catch(e) { console.error('Error in fixPromotionsRoute', e) }
try { fixSchedulesRoute(); } catch(e) { console.error('Error in fixSchedulesRoute', e) }
try { fixPromosiPage(); } catch(e) { console.error('Error in fixPromosiPage', e) }
try { fixJadwalPage(); } catch(e) { console.error('Error in fixJadwalPage', e) }
try { fixAdvancedModules(); } catch(e) { console.error('Error in fixAdvancedModules', e) }
