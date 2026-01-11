import os
from supabase import create_client, Client
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

load_dotenv()
import logging

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
logger = logging.getLogger("uvicorn.error")


async def get_ticket(ticket_id: str) -> str:
    """Fetch ticket details from database"""
    try:
        logger.info(f"🔍 Fetching ticket {ticket_id}")
        response = (
            supabase.table("tickets")
            .select("id, name, category, issue_description")
            .eq("id", ticket_id)
            .single()
            .execute()
        )

        tickets = response.data

        if tickets:
            issue_desc = tickets.get("issue_description", "No Description")
            logger.info(f"✅ Ticket {ticket_id} fetched: {issue_desc[:50]}...")
            return issue_desc
        else:
            logger.warning(f"⚠️ Ticket {ticket_id} not found")
            return "No ticket found"

    except Exception as e:
        logger.error(f"❌ Error fetching ticket {ticket_id}: {e}")
        return f"Error: {str(e)}"


async def create_summary(ticket_id: str, summary: dict) -> str:
    """Save AI summary back to database"""
    try:
        logger.info(f"💾 Saving summary for ticket {ticket_id}")
        logger.info(f"📝 Summary content: {summary}")

        response = (
            supabase.table("tickets").update(summary).eq("id", ticket_id).execute()
        )

        logger.info(f"✅ Summary saved successfully for {ticket_id}")
        return "Summary saved successfully"

    except Exception as e:
        logger.error(f"❌ Error saving summary for {ticket_id}: {e}")
        return f"Error saving: {str(e)}"


root_agent = Agent(
    name="summary_agent",
    model="gemini-2.5-flash-lite",
    description=(
        "Technical QA Agent that analyzes ticket descriptions"
    ),
    instruction=(
        "You are a technical QA support subject-line specialist for a ticketing system. Follow these steps exactly:\n"
        "### 1. PRIORITY RUBRIC (Impact vs Urgency)\n"
        "- Critical: System down, Security breach, or Payment/QRIS failure. No workarounds.\n"
        "- High: Core feature broken (e.g., login failure, transaction history error). High user frustration.\n"
        "- Medium: Minor functional bugs with workarounds or UI/UX confusion.\n"
        "- Low: General questions, cosmetic issues, or feature requests.\n\n"
        "### 2. CATEGORY LIST\n"
        "Choose one: [UI/UX, Technical Bug, Payment, Authentication, Feature Request, Other]\n\n"
        "### 3. EXECUTION STEPS\n"
        "1. CALL 'get_ticket' to read the issue.\n"
        "2. ANALYZE the issue carefully based on the rubrics above.\n"
        "3. PREPARE an analysis object with exactly these fields:\n"
        "   - ai_subject: Concise subject (max 10 words). Example: 'Payment Gateway Timeout'.\n"
        "   - ai_sentiment: Label as Positive, Neutral, or Negative.\n"
        "   - ai_sentiment_score: Numerical value between -1.0 (Very Negative) and 1.0 (Very Positive). 0.0 is Neutral.\n"
        "   - priority: From the Priority Rubric.\n"
        "   - category: From the Category List.\n"
        "4. CALL 'create_summary' with the ticket ID and a dictionary containing ALL those four fields.\n"
        "Do not call the tool multiple times; send everything in one call."
        "Always complete all steps in order."
    ),
    tools=[get_ticket, create_summary],
)

runner = Runner(
    agent=root_agent,
    app_name="summary-agent",
    session_service=InMemorySessionService(),
)
