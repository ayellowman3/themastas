import 'server-only';

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { MATCHES, PLAYER_HANDICAPS, TEAM1_PLAYERS, TEAM2_PLAYERS } from './tournament';

export interface PairingScoreState {
  team1Scores: Record<number, string>;
  team2Scores: Record<number, string>;
  team1PlayerScores: Record<string, Record<number, string>>;
  team2PlayerScores: Record<string, Record<number, string>>;
}

interface HoleScoreRow {
  pairing_id: string;
  side: 'team1' | 'team2';
  player_name: string;
  hole_number: number;
  score: number;
}

let db: DatabaseSync | null = null;

function getDatabasePath() {
  return join(process.cwd(), 'data', 'themastas.sqlite');
}

function getDb() {
  if (db) return db;

  const dbPath = getDatabasePath();
  mkdirSync(dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  initializeSchema(db);
  seedTournamentData(db);

  return db;
}

function initializeSchema(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      team_key TEXT NOT NULL,
      player_number INTEGER NOT NULL,
      name TEXT NOT NULL UNIQUE,
      handicap_index INTEGER NOT NULL,
      nine_hole_handicap INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY,
      round_number INTEGER NOT NULL UNIQUE,
      course TEXT NOT NULL,
      nine TEXT NOT NULL,
      format TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pairings (
      id TEXT PRIMARY KEY,
      match_id INTEGER NOT NULL,
      pairing_order INTEGER NOT NULL,
      team1 TEXT NOT NULL,
      team2 TEXT NOT NULL,
      team1_score REAL,
      team2_score REAL,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (match_id) REFERENCES matches(id)
    );

    CREATE TABLE IF NOT EXISTS hole_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pairing_id TEXT NOT NULL,
      side TEXT NOT NULL,
      player_name TEXT NOT NULL DEFAULT '',
      hole_number INTEGER NOT NULL,
      score INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (pairing_id, side, player_name, hole_number),
      FOREIGN KEY (pairing_id) REFERENCES pairings(id)
    );
  `);
}

function seedTournamentData(database: DatabaseSync) {
  const insertPlayer = database.prepare(`
    INSERT OR IGNORE INTO players (id, team_key, player_number, name, handicap_index, nine_hole_handicap)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const [number, name] of Object.entries(TEAM1_PLAYERS)) {
    const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];
    insertPlayer.run(`team1-${number}`, 'team1', Number(number), name, handicap.index, handicap.nineHole);
  }

  for (const [number, name] of Object.entries(TEAM2_PLAYERS)) {
    const handicap = PLAYER_HANDICAPS[name as keyof typeof PLAYER_HANDICAPS];
    insertPlayer.run(`team2-${number}`, 'team2', Number(number), name, handicap.index, handicap.nineHole);
  }

  const insertMatch = database.prepare(`
    INSERT OR IGNORE INTO matches (id, round_number, course, nine, format)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertPairing = database.prepare(`
    INSERT OR IGNORE INTO pairings (id, match_id, pairing_order, team1, team2, team1_score, team2_score, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  MATCHES.forEach((match) => {
    insertMatch.run(match.round, match.round, match.course, match.nine, match.format);

    match.pairings.forEach((pairing, index) => {
      insertPairing.run(
        pairing.id,
        match.round,
        index + 1,
        pairing.team1,
        pairing.team2,
        pairing.team1Score,
        pairing.team2Score,
        pairing.completed ? 1 : 0
      );
    });
  });
}

export function getAllPairingScores(): Record<string, PairingScoreState> {
  const database = getDb();
  const rows = database.prepare(`
    SELECT pairing_id, side, player_name, hole_number, score
    FROM hole_scores
    ORDER BY pairing_id, side, player_name, hole_number
  `).all() as HoleScoreRow[];

  const scoresByPairing: Record<string, PairingScoreState> = {};

  for (const row of rows) {
    if (!scoresByPairing[row.pairing_id]) {
      scoresByPairing[row.pairing_id] = {
        team1Scores: {},
        team2Scores: {},
        team1PlayerScores: {},
        team2PlayerScores: {},
      };
    }

    const pairingScores = scoresByPairing[row.pairing_id];
    const scoreValue = String(row.score);

    if (row.player_name) {
      const playerScores = row.side === 'team1' ? pairingScores.team1PlayerScores : pairingScores.team2PlayerScores;
      playerScores[row.player_name] = {
        ...(playerScores[row.player_name] || {}),
        [row.hole_number]: scoreValue,
      };
    } else if (row.side === 'team1') {
      pairingScores.team1Scores[row.hole_number] = scoreValue;
    } else {
      pairingScores.team2Scores[row.hole_number] = scoreValue;
    }
  }

  return scoresByPairing;
}

export function getPairingScoreState(pairingId: string): PairingScoreState {
  return (
    getAllPairingScores()[pairingId] || {
      team1Scores: {},
      team2Scores: {},
      team1PlayerScores: {},
      team2PlayerScores: {},
    }
  );
}

export function saveHoleScore(input: {
  pairingId: string;
  side: 'team1' | 'team2';
  hole: number;
  score: number | null;
  playerName?: string | null;
}) {
  const database = getDb();
  const playerName = input.playerName ?? '';

  if (input.score === null) {
    database
      .prepare(`
        DELETE FROM hole_scores
        WHERE pairing_id = ? AND side = ? AND player_name = ? AND hole_number = ?
      `)
      .run(input.pairingId, input.side, playerName, input.hole);
    return;
  }

  database
    .prepare(`
      INSERT INTO hole_scores (pairing_id, side, player_name, hole_number, score)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(pairing_id, side, player_name, hole_number)
      DO UPDATE SET
        score = excluded.score,
        updated_at = CURRENT_TIMESTAMP
    `)
    .run(input.pairingId, input.side, playerName, input.hole, input.score);
}
