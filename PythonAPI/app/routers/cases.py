from fastapi import APIRouter, HTTPException
from typing import List
from app.models.request import CaseSearchRequest
from app.models.response import CaseResponse
from app.services.jagriti import (
    resolve_state_commission_ids,
    search_cases_on_jagriti
)

router = APIRouter()

SEARCH_TYPE_MAP = {
    "by-case-number": "caseNumber",
    "by-complainant": "complainant",
    "by-respondent": "respondent",
    "by-complainant-advocate": "complainantAdvocate",
    "by-respondent-advocate": "respondentAdvocate",
    "by-industry-type": "industryType",
    "by-judge": "judge"
}

def make_endpoint(search_key: str):
    @router.post(f"/{search_key}", response_model=List[CaseResponse])
    async def endpoint(payload: CaseSearchRequest):
        try:
            state_id, commission_id = await resolve_state_commission_ids(payload.state, payload.commission)
            if not state_id or not commission_id:
                raise HTTPException(status_code=400, detail="Invalid state or commission")

            jagriti_search_type = SEARCH_TYPE_MAP.get(search_key)
            results = await search_cases_on_jagriti(
                state_id=state_id,
                commission_id=commission_id,
                search_type=jagriti_search_type,
                search_value=payload.search_value,
                date_from=payload.date_from,
                date_to=payload.date_to
            )
            return results
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return endpoint

for key in SEARCH_TYPE_MAP.keys():
    make_endpoint(key)
