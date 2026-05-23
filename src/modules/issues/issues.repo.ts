import { pool } from "../../config/db";

import { IIssue } from "../../interfaces/issues.interface";

export const createIssueIntoDB =
  async (payload: IIssue) => {
    const query = `
      INSERT INTO issues (
        title,
        description,
        type,
        reporter_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      payload.title,
      payload.description,
      payload.type,
      payload.reporter_id,
    ];

    const result = await pool.query(
      query,
      values
    );

    return result.rows[0];
  };

export const getAllIssuesFromDB =
  async (
    sort: string,
    type?: string,
    status?: string
  ) => {
    let query = `
      SELECT *
      FROM issues
    `;

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (type) {
      values.push(type);

      conditions.push(
        `type = $${values.length}`
      );
    }

    if (status) {
      values.push(status);

      conditions.push(
        `status = $${values.length}`
      );
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(
        " AND "
      )}`;
    }

    query += `
      ORDER BY created_at
      ${sort === "oldest"
        ? "ASC"
        : "DESC"}
    `;

    const result = await pool.query(
      query,
      values
    );

    return result.rows;
  };

export const getIssueByIdFromDB =
  async (id: number) => {
    const query = `
      SELECT *
      FROM issues
      WHERE id = $1
    `;

    const result = await pool.query(
      query,
      [id]
    );

    return result.rows[0];
  };

export const updateIssueIntoDB =
  async (
    id: number,
    payload: Partial<IIssue>
  ) => {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (payload.title !== undefined) {
      values.push(payload.title);
      updates.push(
        `title = $${values.length}`
      );
    }

    if (
      payload.description !== undefined
    ) {
      values.push(
        payload.description
      );
      updates.push(
        `description = $${values.length}`
      );
    }

    if (payload.type !== undefined) {
      values.push(payload.type);
      updates.push(
        `type = $${values.length}`
      );
    }

    if (payload.status !== undefined) {
      values.push(payload.status);
      updates.push(
        `status = $${values.length}`
      );
    }

    values.push(id);

    const query = `
      UPDATE issues
      SET ${updates.join(", ")},
          updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(
      query,
      values
    );

    return result.rows[0];
  };

export const deleteIssueFromDB =
  async (id: number) => {
    const query = `
      DELETE FROM issues
      WHERE id = $1
    `;

    await pool.query(query, [id]);
  };

export const getUsersByIdsFromDB =
  async (
    ids: number[]
  ) => {
    if (ids.length === 0) {
      return [];
    }

    const placeholders = ids
      .map(
        (_, index) =>
          `$${index + 1}`
      )
      .join(", ");

    const query = `
      SELECT id, name, role
      FROM users
      WHERE id IN (${placeholders})
    `;

    const result = await pool.query(
      query,
      ids
    );

    return result.rows;
  };