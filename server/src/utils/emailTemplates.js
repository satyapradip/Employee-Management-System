/**
 * Email Templates for Task Notifications
 */

export const taskAssignedTemplate = ({ employeeName, task, adminName, frontendUrl }) => {
  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    urgent: "#dc2626",
  };

  const priorityColor = priorityColors[task.priority] || "#3b82f6";

  return {
    subject: `New Task Assigned: ${task.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial; background:#f9fafb; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px;">
            <h2 style="color:#4f46e5;">📋 New Task Assigned</h2>
            <p>Hi <strong>${employeeName}</strong>,</p>
            <p><strong>${adminName}</strong> assigned you a task.</p>

            <div style="background:#f3f4f6; padding:15px; border-radius:8px;">
              <p><strong>Title:</strong> ${task.title}</p>
              <p><strong>Description:</strong> ${task.description}</p>
              <p><strong>Category:</strong> ${task.category}</p>
              <p>
                <strong>Priority:</strong>
                <span style="color:white; background:${priorityColor}; padding:4px 10px; border-radius:12px;">
                  ${task.priority}
                </span>
              </p>
              <p><strong>Due:</strong> ${new Date(task.dueDate).toDateString()}</p>
            </div>

            <p style="margin-top:20px; text-align:center;">
              <a href="${frontendUrl}" style="padding:12px 24px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">
                View Dashboard
              </a>
            </p>

            <p style="font-size:12px; color:#6b7280; text-align:center;">
              This is an automated email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${employeeName},

${adminName} assigned you a task.

Title: ${task.title}
Priority: ${task.priority}
Due: ${new Date(task.dueDate).toDateString()}

Login: ${frontendUrl}
    `,
  };
};

export const taskCompletedTemplate = ({ adminName, task, employeeName, frontendUrl }) => ({
  subject: `Task Completed: ${task.title}`,
  html: `
    <p>Hi ${adminName},</p>
    <p><strong>${employeeName}</strong> completed the task:</p>
    <p><strong>${task.title}</strong></p>
    <a href="${frontendUrl}">View Dashboard</a>
  `,
  text: `${employeeName} completed ${task.title}`,
});

export const taskFailedTemplate = ({ adminName, task, employeeName, frontendUrl }) => ({
  subject: `Task Failed: ${task.title}`,
  html: `
    <p>Hi ${adminName},</p>
    <p><strong>${employeeName}</strong> marked task as failed:</p>
    <p><strong>${task.title}</strong></p>
    <p>Reason: ${task.failureReason || "Not provided"}</p>
    <a href="${frontendUrl}">View Dashboard</a>
  `,
  text: `${employeeName} failed ${task.title}`,
});
