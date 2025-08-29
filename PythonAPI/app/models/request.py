from pydantic import BaseModel, Field
from typing import Optional

class CaseSearchRequest(BaseModel):
    state: str = Field(..., description="State name, e.g., 'KARNATAKA'")
    commission: str = Field(..., description="Commission name, e.g., 'Bangalore 1st & Rural Additional'")
    search_value: str = Field(..., description="Search string, e.g., 'Reddy'")

    # optional: override date range (ISO yyyy-mm-dd)
    date_from: Optional[str] = Field(None, description="Start date (YYYY-MM-DD) for Case Filing Date filter")
    date_to: Optional[str] = Field(None, description="End date (YYYY-MM-DD) for Case Filing Date filter")
