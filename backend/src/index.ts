import { Hono } from 'hono'
import { cors } from 'hono/cors';


const app = new Hono()

app.use("*", cors({
  origin: "http://localhost:5173",
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
  allowHeaders: ["Content-Type"]

}))


app.post("/user/ticket", async (c) => {
  const body = await c.req.json();
  console.log(body)

  return c.json({
    data_received: body
  })
})


export default app
