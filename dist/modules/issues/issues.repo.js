"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByIdsFromDB = exports.deleteIssueFromDB = exports.updateIssueIntoDB = exports.getIssueByIdFromDB = exports.getAllIssuesFromDB = exports.createIssueIntoDB = void 0;
const db_1 = require("../../config/db");
const createIssueIntoDB = async (payload) => {
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
    const result = await db_1.pool.query(query, values);
    return result.rows[0];
};
exports.createIssueIntoDB = createIssueIntoDB;
const getAllIssuesFromDB = async (sort, type, status) => {
    let query = `
      SELECT *
      FROM issues
    `;
    const conditions = [];
    const values = [];
    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }
    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += `
      ORDER BY created_at
      ${sort === "oldest"
        ? "ASC"
        : "DESC"}
    `;
    const result = await db_1.pool.query(query, values);
    return result.rows;
};
exports.getAllIssuesFromDB = getAllIssuesFromDB;
const getIssueByIdFromDB = async (id) => {
    const query = `
      SELECT *
      FROM issues
      WHERE id = $1
    `;
    const result = await db_1.pool.query(query, [id]);
    return result.rows[0];
};
exports.getIssueByIdFromDB = getIssueByIdFromDB;
const updateIssueIntoDB = async (id, payload) => {
    const updates = [];
    const values = [];
    if (payload.title !== undefined) {
        values.push(payload.title);
        updates.push(`title = $${values.length}`);
    }
    if (payload.description !== undefined) {
        values.push(payload.description);
        updates.push(`description = $${values.length}`);
    }
    if (payload.type !== undefined) {
        values.push(payload.type);
        updates.push(`type = $${values.length}`);
    }
    if (payload.status !== undefined) {
        values.push(payload.status);
        updates.push(`status = $${values.length}`);
    }
    values.push(id);
    const query = `
      UPDATE issues
      SET ${updates.join(", ")},
          updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;
    const result = await db_1.pool.query(query, values);
    return result.rows[0];
};
exports.updateIssueIntoDB = updateIssueIntoDB;
const deleteIssueFromDB = async (id) => {
    const query = `
      DELETE FROM issues
      WHERE id = $1
    `;
    await db_1.pool.query(query, [id]);
};
exports.deleteIssueFromDB = deleteIssueFromDB;
const getUsersByIdsFromDB = async (ids) => {
    if (ids.length === 0) {
        return [];
    }
    const placeholders = ids
        .map((_, index) => `$${index + 1}`)
        .join(", ");
    const query = `
      SELECT id, name, role
      FROM users
      WHERE id IN (${placeholders})
    `;
    const result = await db_1.pool.query(query, ids);
    return result.rows;
};
exports.getUsersByIdsFromDB = getUsersByIdsFromDB;
