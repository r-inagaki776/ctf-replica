/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ctf-replica",
      removal: "remove",
      home: "aws",
    };
  },
  async run() {
    // ---- DynamoDB Tables ----

    // Q1: セッション改竄問題
    const q1UsersTable = new sst.aws.Dynamo("Q1Users", {
      fields: { username: "string" },
      primaryIndex: { hashKey: "username" },
    });

    // Q3: SQLi + Vulnerability Chain
    const q3UsersTable = new sst.aws.Dynamo("Q3Users", {
      fields: { username: "string" },
      primaryIndex: { hashKey: "username" },
    });

    // ---- Next.js ----
    new sst.aws.Nextjs("CtfReplica", {
      link: [q1UsersTable, q3UsersTable],
      environment: {
        Q1_USERS_TABLE_NAME: q1UsersTable.name,
        Q3_USERS_TABLE_NAME: q3UsersTable.name,
        Q2_FLAG_FILE_CONTENT: "INDEX{0s_cmd_1nj3ct10n_pwn3d}",
      },
    });
  },
});
