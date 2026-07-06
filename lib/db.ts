import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { normalizeBusId } from "./bus-utils";
import { getSampleBuses } from "./sample-data";

const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "aitam.db");

let database: any = null;

function getDatabase() {
  if (!database) {
    mkdirSync(dbDir, { recursive: true });
    database = new Database(dbPath);
    database.pragma("journal_mode = WAL");

    database.exec(`
      CREATE TABLE IF NOT EXISTS buses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_id TEXT UNIQUE NOT NULL,
        registration_number TEXT NOT NULL,
        driver_name TEXT NOT NULL,
        route TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        status TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_id TEXT NOT NULL,
        registration_number TEXT NOT NULL,
        driver_name TEXT NOT NULL,
        route TEXT NOT NULL,
        date TEXT NOT NULL,
        in_time TEXT,
        out_time TEXT,
        status TEXT NOT NULL
      );
    `);

    const count = database.prepare("SELECT COUNT(*) as cnt FROM buses").get().cnt;
    if (count === 0) {
      const insertBus = database.prepare(`
        INSERT INTO buses (bus_id, registration_number, driver_name, route, capacity, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const sampleBuses = getSampleBuses();
      const insertMany = database.transaction((rows: typeof sampleBuses) => {
        for (const row of rows) {
          insertBus.run(row.bus_id, row.registration_number, row.driver_name, row.route, row.capacity, row.status);
        }
      });
      insertMany(sampleBuses);
    }
  }

  return database;
}

export function listBuses() {
  return getDatabase().prepare("SELECT * FROM buses ORDER BY bus_id").all();
}

export function getBusById(busId: string) {
  return getDatabase().prepare("SELECT * FROM buses WHERE bus_id = ?").get(normalizeBusId(busId));
}

export function getDashboardSummary(date: string) {
  const db = getDatabase();
  const totalBuses = db.prepare("SELECT COUNT(*) as count FROM buses").get().count;
  const todayIn = db.prepare("SELECT COUNT(*) as count FROM logs WHERE date = ? AND in_time IS NOT NULL").get(date).count;
  const todayOut = db.prepare("SELECT COUNT(*) as count FROM logs WHERE date = ? AND out_time IS NOT NULL").get(date).count;
  const currentlyOutside = db.prepare("SELECT COUNT(*) as count FROM logs WHERE date = ? AND status = 'Outside Campus'").get(date).count;

  return {
    totalBuses,
    todayIn,
    todayOut,
    currentlyOutside,
  };
}

export function getLogsForDate(date: string) {
  return getDatabase()
    .prepare("SELECT * FROM logs WHERE date = ? ORDER BY in_time IS NULL, in_time, out_time")
    .all(date);
}

export function getLogsByFilters(date: string, filters: { busId?: string; driver?: string; registration?: string }) {
  const db = getDatabase();
  const clauses: string[] = ["date = ?"];
  const values: unknown[] = [date];

  if (filters.busId) {
    clauses.push("bus_id = ?");
    values.push(normalizeBusId(filters.busId));
  }
  if (filters.driver) {
    clauses.push("driver_name LIKE ?");
    values.push(`%${filters.driver}%`);
  }
  if (filters.registration) {
    clauses.push("registration_number LIKE ?");
    values.push(`%${filters.registration}%`);
  }

  const query = `SELECT * FROM logs WHERE ${clauses.join(" AND ")} ORDER BY in_time IS NULL, in_time, out_time`;
  return db.prepare(query).all(...values);
}

export function createLogEntry(payload: {
  busId: string;
  action: "in" | "out";
  date: string;
}) {
  const db = getDatabase();
  const normalizedBusId = normalizeBusId(payload.busId);
  const bus = db.prepare("SELECT * FROM buses WHERE bus_id = ?").get(normalizedBusId);

  if (!bus) {
    throw new Error("Bus not found.");
  }

  const existing = db.prepare("SELECT * FROM logs WHERE bus_id = ? AND date = ?").get(normalizedBusId, payload.date);

  if (payload.action === "in") {
    if (existing) {
      throw new Error("Duplicate IN detected for this bus today.");
    }

    const insert = db.prepare(`
      INSERT INTO logs (bus_id, registration_number, driver_name, route, date, in_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(normalizedBusId, bus.registration_number, bus.driver_name, bus.route, payload.date, new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), "Inside Campus");
    return getLogsForDate(payload.date).find((entry: { bus_id: string }) => entry.bus_id === normalizedBusId);
  }

  if (!existing) {
    throw new Error("No active bus record found for OUT operation.");
  }

  if (existing.out_time) {
    throw new Error("Duplicate OUT detected for this bus today.");
  }

  const update = db.prepare(`
    UPDATE logs
    SET out_time = ?, status = ?
    WHERE id = ?
  `);
  update.run(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), "Outside Campus", existing.id);

  return db.prepare("SELECT * FROM logs WHERE id = ?").get(existing.id);
}

export function getDbFilePath() {
  return dbPath;
}

export function resetDatabase() {
  if (existsSync(dbPath)) {
    database?.close();
    database = null;
    require("node:fs").unlinkSync(dbPath);
  }
}
