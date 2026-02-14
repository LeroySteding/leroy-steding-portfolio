import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Linear Webhook Handler
 *
 * Configure in Linear:
 * 1. Go to Settings → API → Webhooks
 * 2. Create new webhook
 * 3. URL: https://[your-convex-url]/linearWebhook
 * 4. Subscribe to: Issue created, Issue updated, Issue deleted
 * 5. Save signing secret to environment
 */
export const linearWebhook = httpAction(async (ctx, request) => {
  // Verify webhook signature (recommended for production)
  const signature = request.headers.get("linear-signature");
  const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;

  if (webhookSecret && signature) {
    const body = await request.text();
    // TODO: Implement signature verification if needed
    // const isValid = verifyLinearSignature(body, signature, webhookSecret);
    // if (!isValid) {
    //   return new Response("Invalid signature", { status: 401 });
    // }
  }

  // Parse webhook payload
  let payload: any;
  try {
    const bodyText = await request.text();
    payload = JSON.parse(bodyText);
  } catch (error) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { type, action, data } = payload;

  console.log(`Linear webhook received: ${type} ${action}`);

  try {
    switch (type) {
      case "Issue":
        switch (action) {
          case "create":
          case "update":
            // Sync issue to Convex
            await ctx.runAction(internal.linearSync.syncIssueToTask, {
              issueId: data.id,
            });
            break;

          case "remove":
            // Mark task as cancelled when issue is deleted
            const task = await ctx.runQuery(
              internal.linearQueries.findTaskByLinearId,
              { linearIssueId: data.id }
            );

            if (task) {
              await ctx.runMutation(internal.linearQueries.updateTaskFromLinear, {
                taskId: task._id,
                title: task.title,
                description: task.description,
                status: "cancelled",
                priority: task.priority,
                assignedTo: task.assignedTo,
              });
            }
            break;
        }
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing Linear webhook:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
