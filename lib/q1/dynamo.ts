/**
 * Q1 DynamoDB helper
 * テーブル名は環境変数 Q1_USERS_TABLE_NAME から取得（SSTがlinkで自動注入）
 *
 * スキーマ:
 *   PK: username (string)
 *   Attributes: password, email, is_admin (number: 0|1), flag (string|null)
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

// SSTがlinkに応じて自動挿入する環境変数名
const TABLE_NAME = process.env.Q1_USERS_TABLE_NAME!;

export type Q1User = {
  username: string;
  password: string;
  email: string;
  is_admin: number;
  flag: string | null;
};

/** ユーザーをusernameで取得 */
export async function getUser(username: string): Promise<Q1User | undefined> {
  const res = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { username } })
  );
  return res.Item as Q1User | undefined;
}

/** 初期データを投入（存在しない場合のみ） */
export async function seedIfEmpty() {
  const existing = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME, Limit: 1 })
  );
  if ((existing.Count ?? 0) > 0) return;

  const users: Q1User[] = [
    { username: "admin", password: "Adm!n_CTF_2026", email: "admin@ctf.local", is_admin: 1, flag: "INDEX{c00k13_s3ss10n_f0rg3ry}" },
    { username: "alice", password: "alice123", email: "alice@ctf.local", is_admin: 0, flag: null },
    { username: "bob",   password: "bob456",   email: "bob@ctf.local",   is_admin: 0, flag: null },
  ];

  for (const u of users) {
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: u }));
  }
}
