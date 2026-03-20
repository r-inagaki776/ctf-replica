/**
 * Q3 DynamoDB helper (簡素化版)
 * テーブル名は環境変数 Q3_USERS_TABLE_NAME から取得
 *
 * Q3Usersスキーマ:
 *   PK: username (string)
 *   Attributes: password, role
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

const USERS_TABLE = process.env.Q3_USERS_TABLE_NAME!;

export type Q3User = {
  username: string;
  password: string;
  role: string;
};

// ---- Users ----

export async function getUser(username: string): Promise<Q3User | undefined> {
  const res = await docClient.send(
    new GetCommand({ TableName: USERS_TABLE, Key: { username } })
  );
  return res.Item as Q3User | undefined;
}

// ---- Seed ----

export async function seedIfEmpty() {
  const existingUsers = await docClient.send(
    new ScanCommand({ TableName: USERS_TABLE, Limit: 1 })
  );
  if ((existingUsers.Count ?? 0) > 0) return;

  const users: Q3User[] = [
    { username: "admin",     password: "Str0ngP@ssw0rd!!", role: "admin" },
    { username: "tanaka",    password: "tanaka123",         role: "user"  },
    { username: "sato",      password: "sAto_s3cure_99",   role: "user"  },
    { username: "suzuki",    password: "suzuki_P@ss_2026", role: "user"  },
  ];

  for (const u of users) {
    await docClient.send(new PutCommand({ TableName: USERS_TABLE, Item: u }));
  }
}
