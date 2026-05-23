import AppError from "../../utils/AppError";

import { IIssue } from "../../interfaces/issues.interface";
import {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getIssueByIdFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
  getUsersByIdsFromDB,
} from "./issues.repo";


export const createIssue = async (
  payload: IIssue
) => {
  return await createIssueIntoDB(
    payload
  );
};

export const getAllIssues =
  async (
    sort: string,
    type?: string,
    status?: string
  ) => {
    const issues =
      await getAllIssuesFromDB(
        sort,
        type,
        status
      );

    const reporterIds = [
      ...new Set(
        issues.map(
          (
            issue: IIssue
          ) => issue.reporter_id as number
        )
      ),
    ];

    const reporters =
      await getUsersByIdsFromDB(
        reporterIds
      );

    const reporterMap = new Map();

    reporters.forEach(
      (reporter) => {
        reporterMap.set(
          reporter.id,
          reporter
        );
      }
    );

    const formattedIssues =
      issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description:
          issue.description,
        type: issue.type,
        status: issue.status,
        reporter:
          reporterMap.get(
            issue.reporter_id
          ),
        created_at:
          issue.created_at,
        updated_at:
          issue.updated_at,
      }));

    return formattedIssues;
  };

export const getSingleIssue =
  async (id: number) => {
    const issue =
      await getIssueByIdFromDB(
        id
      );

    if (!issue) {
      throw new AppError(
        404,
        "Issue not found"
      );
    }

    const reporters =
      await getUsersByIdsFromDB(
        [issue.reporter_id]
      );

    return {
      id: issue.id,
      title: issue.title,
      description:
        issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporters[0],
      created_at:
        issue.created_at,
      updated_at:
        issue.updated_at,
    };
  };

export const updateIssue = async (
  id: number,
  payload: Partial<IIssue>,
  user: {
    id: number;
    role: string;
  }
) => {
  const issue =
    await getIssueByIdFromDB(
      id
    );

  if (!issue) {
    throw new AppError(
      404,
      "Issue not found"
    );
  }

  // contributor permission
  if (
    user.role === "contributor"
  ) {
    if (
      issue.reporter_id !== user.id
    ) {
      throw new AppError(
        403,
        "Forbidden"
      );
    }

    if (
      issue.status !== "open"
    ) {
      throw new AppError(
        409,
        "Cannot edit non-open issue"
      );
    }
  }

  return await updateIssueIntoDB(
    id,
    payload
  );
};

export const deleteIssue =
  async (id: number) => {
    const issue =
      await getIssueByIdFromDB(
        id
      );

    if (!issue) {
      throw new AppError(
        404,
        "Issue not found"
      );
    }

    await deleteIssueFromDB(
      id
    );
  };