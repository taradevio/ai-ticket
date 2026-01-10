import os
from supabase import create_client, Client
from typing import Union
from dotenv import load_dotenv
from agent.agent import runner
from google.genai import types

load_dotenv()

from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import logging

app = FastAPI()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
logger = logging.getLogger("uvicorn.error")

# Set log level ke INFO biar keliatan semua
logging.basicConfig(level=logging.INFO)


class TicketTrigger(BaseModel):
    ticket_id: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


async def safe_run_summary(ticket_id: str):
    session = None
    try:
        logger.info(f"🚀 Starting summary for ticket {ticket_id}")

        app_name = "summary-agent"
        user_id = "system"

        # STEP 1: Create session
        try:
            session = await runner.session_service.create_session(
                app_name=app_name, user_id=user_id, state={"ticket_id": ticket_id}
            )
            logger.info(f"✅ Session created: {session.id}")
        except Exception as session_err:
            logger.error(f"❌ Failed to create session: {session_err}")
            return

        # STEP 2: Create message
        user_message = types.Content(
            role="user", parts=[types.Part(text=f"Process ticket {ticket_id}")]
        )

        # STEP 3: Run agent and handle ALL events
        logger.info(f"🤖 Running agent...")

        event_count = 0
        async for event in runner.run_async(
            user_id=user_id, session_id=session.id, new_message=user_message
        ):
            print(event.__annotations__)
            event_count += 1
            event_type = type(event).__name__
            logger.info(f"Event #{event_count}: {event_type}")

            # Handle tool calls
            if hasattr(event, "tool_name"):
                logger.info(f"Tool: {event.tool_name}")
                if hasattr(event, "tool_input"):
                    logger.info(f"Input: {event.tool_input}")

            # Handle tool results
            if hasattr(event, "tool_result"):
                logger.info(f"Result: {str(event.tool_result)[:200]}")

            # Handle agent messages
            if hasattr(event, "content") and hasattr(event.content, "parts"):
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        logger.info(f"Agent: {part.text[:200]}")

            # Check for final response
            if hasattr(event, "is_final_response"):
                if event.is_final_response():
                    logger.info(f"FINAL RESPONSE")

        logger.info(f"Completed! Total events: {event_count}")

    except Exception as e:
        logger.error(f"❌ Failed for {ticket_id}: {e}", exc_info=True)

    finally:
        # ALWAYS cleanup session
        if session:
            try:
                await runner.session_service.delete_session(
                    app_name=session.app_name,
                    user_id=session.user_id,
                    session_id=session.id,
                )
                logger.info(f"🗑️ Session cleaned up: {session.id}")
            except Exception as cleanup_err:
                logger.warning(f"⚠️ Cleanup failed: {cleanup_err}")


@app.post("/tickets")
async def trigger(payload: TicketTrigger, background_task: BackgroundTasks):
    logger.info(f"📥 REQUEST: ticket {payload.ticket_id}")

    background_task.add_task(safe_run_summary, ticket_id=payload.ticket_id)

    return {
        "status": "Summary process started in background",
        "ticket_id": payload.ticket_id,
    }
