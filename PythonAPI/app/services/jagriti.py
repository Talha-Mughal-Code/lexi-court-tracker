import httpx
from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urljoin

from app.config import GET_STATE_COMMISSION, GET_CASES_BY_SEARCH, DEFAULT_DATE_RANGE_DAYS
from app.models.response import CaseResponse

# simple in-memory cache for states & commissions
_state_commission_cache = {"data": None, "fetched_at": None}
_CACHE_TTL_SECONDS = 3600  # 1 hour


async def get_states_and_commissions() -> List[Dict[str, Any]]:
    """
    Fetch list of states and commissions from Jagriti (with cache).
    """
    now = datetime.utcnow()
    if (
        _state_commission_cache["data"]
        and _state_commission_cache["fetched_at"]
        and (now - _state_commission_cache["fetched_at"]).total_seconds() < _CACHE_TTL_SECONDS
    ):
        return _state_commission_cache["data"]

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(GET_STATE_COMMISSION)
        resp.raise_for_status()
        data = resp.json()

    if not isinstance(data, list):
        raise ValueError("Unexpected format from Jagriti states API")

    _state_commission_cache["data"] = data
    _state_commission_cache["fetched_at"] = now
    return data


async def resolve_state_commission_ids(state_name: str, commission_name: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Match state and commission names → return (stateCode, distCode).
    """
    data = await get_states_and_commissions()
    state_id, commission_id = None, None

    state_name = state_name.strip().lower()
    commission_name = commission_name.strip().lower()

    for s in data:
        if state_name in str(s.get("stateName", "")).lower():
            state_id = s.get("stateCode")
            for c in s.get("commissions", []):
                if commission_name in str(c.get("distName", "")).lower():
                    commission_id = c.get("distCode")
                    break
            break

    return state_id, commission_id


def _default_date_range() -> Tuple[str, str]:
    today = date.today()
    start = today - timedelta(days=DEFAULT_DATE_RANGE_DAYS)
    return start.isoformat(), today.isoformat()


async def search_cases_on_jagriti(
    state_id: str,
    commission_id: str,
    search_type: str,
    search_value: str,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
) -> List[CaseResponse]:
    """
    Calls Jagriti search endpoint and maps to CaseResponse.
    """
    if not date_from or not date_to:
        date_from, date_to = _default_date_range()

    payload = {
        "stateCode": state_id,
        "distCode": commission_id,
        "searchType": search_type,
        "searchValue": search_value,
        "dateFilterType": "CASE_FILING_DATE",
        "fromDate": date_from,
        "toDate": date_to,
        "orderType": "DAILY_ORDERS",
        "captcha": "bypass",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(GET_CASES_BY_SEARCH, json=payload)
        resp.raise_for_status()
        result = resp.json()

    cases_raw = None
    if isinstance(result, dict):
        for key in ("caseDetails", "cases", "result", "data", "caseDetailList", "caseList"):
            if key in result:
                cases_raw = result[key]
                break
    elif isinstance(result, list):
        cases_raw = result

    if not cases_raw:
        return []

    cases: List[CaseResponse] = []
    for item in cases_raw:
        cases.append(
            CaseResponse(
                case_number=str(item.get("caseNumber", "")),
                case_stage=str(item.get("caseStage", "")),
                filing_date=str(item.get("filingDate", "")),
                complainant=str(item.get("complainantName", "")),
                complainant_advocate=str(item.get("complainantAdvocate", "")),
                respondent=str(item.get("respondentName", "")),
                respondent_advocate=str(item.get("respondentAdvocate", "")),
                document_link=str(item.get("documentLink", "")),
            )
        )
    return cases
