import { sendEmail } from "../utils/sendEmail.js";
import {
  taskAssignedTemplate,
  taskCompletedTemplate,
  taskFailedTemplate,
} from "../utils/emailTemplates.js";
import env from "../config/env.js";

/**
 * Send email when a task is assigned to an employee
 */
export const notifyTaskAssigned = async (task, employee, admin) => {
  try {
    const emailData = taskAssignedTemplate({
      employeeName: employee.name,
      task: {
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate,
      },
      adminName: admin.name,
      frontendUrl: env.FRONTEND_URL,
    });

    await sendEmail({
      to: employee.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    console.log(`📧 Task assignment email sent to ${employee.email}`);
  } catch (error) {
    console.error("Failed to send task assignment email:", error.message);
    // Don't throw error - notification failure shouldn't break task creation
  }
};

/**
 * Send email when an employee completes a task
 */
export const notifyTaskCompleted = async (task, employee, admin) => {
  try {
    const emailData = taskCompletedTemplate({
      adminName: admin.name,
      task: {
        title: task.title,
        category: task.category,
        completedAt: task.completedAt,
      },
      employeeName: employee.name,
      frontendUrl: env.FRONTEND_URL,
    });

    await sendEmail({
      to: admin.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    console.log(`📧 Task completion email sent to ${admin.email}`);
  } catch (error) {
    console.error("Failed to send task completion email:", error.message);
  }
};

/**
 * Send email when an employee marks a task as failed
 */
export const notifyTaskFailed = async (task, employee, admin) => {
  try {
    const emailData = taskFailedTemplate({
      adminName: admin.name,
      task: {
        title: task.title,
        category: task.category,
        failedAt: task.failedAt,
        failureReason: task.failureReason,
      },
      employeeName: employee.name,
      frontendUrl: env.FRONTEND_URL,
    });

    await sendEmail({
      to: admin.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    console.log(`📧 Task failure email sent to ${admin.email}`);
  } catch (error) {
    console.error("Failed to send task failure email:", error.message);
  }
};
