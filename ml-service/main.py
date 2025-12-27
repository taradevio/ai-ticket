import os
from supabase import create_client, Client
from typing import Union
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import logging

app = FastAPI()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
logger = logging.getLogger("uvicorn.error")

class TicketTrigger(BaseModel):
    ticket_id: str
    
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/tickets")
async def trigger(payload: TicketTrigger):
    logger.info(f"Received from hono {payload.ticket_id}")
    
    response = (
        supabase.table("tickets")
        .select("id, name, category, issue_description")
        .eq("id", payload.ticket_id)
        .single()
        .execute()
    )
        
    tickets = response.data
    
    if tickets:
        logger.info(f"Ticket {payload.ticket_id} fetched successfully: {tickets.get('issue_description', 'No Descriptions')}")
        
    else:
        logger.info(f"Ticket {payload.ticket_id} unsucessfully fetched")
    
    
    return {"status": "ok"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}