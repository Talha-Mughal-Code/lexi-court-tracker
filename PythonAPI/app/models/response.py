from pydantic import BaseModel
from typing import Optional
from datetime import date

class CaseResponse(BaseModel):
    case_number: Optional[str]
    case_stage: Optional[str]
    filing_date: Optional[str]  # ISO string 'YYYY-MM-DD'
    complainant: Optional[str]
    complainant_advocate: Optional[str]
    respondent: Optional[str]
    respondent_advocate: Optional[str]
    document_link: Optional[str]
