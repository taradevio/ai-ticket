import { Hono } from "hono";
import { cors } from "hono/cors";
import { createClient } from "@supabase/supabase-js";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type"],
  })
);

const supabase_service = (c: any) =>
  createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE);

app.get("/", (c) => {
  return c.text("Welcome to Hono!");
});

app.post("/user/ticket", async (c) => {
  const db = supabase_service(c);

  const body = await c.req.json();

  try {
    const { data, error } = await db
      .from("tickets")
      .insert({
        email: body.email,
        name: body.name,
        category: body.category,
        issue_description: body.issue,
      })
      .select("id")
      .single();

    if (data) {
      console.log("Ticket submitted Sucessfully!", data.id);
    }

    if (error) {
      console.error("Error when inserting data", error);
      return c.json({ success: false, error: "failed to create ticker" }, 500);
    }

    return c.json(
      {
        success: true,
        ticket_id: data.id,
        message: "Ticket submitted successfully!",
      },
      201
    );
  } catch (error) {
    return c.json({ success: false, error: "Internal Server Error" }, 500);
  }
});

export default app;
