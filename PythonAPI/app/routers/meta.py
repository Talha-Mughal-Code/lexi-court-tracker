import httpx
from fastapi import APIRouter, HTTPException, Query, Body

router = APIRouter()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://e-jagriti.gov.in/",
}

STATES_URL = "https://e-jagriti.gov.in/services/report/report/getStateCommissionAndCircuitBench"
COMMISSIONS_URL = "https://e-jagriti.gov.in/services/report/report/getDistrictCommissionByCommissionId"
ADDRESS_URL = "https://e-jagriti.gov.in/services/report/report/getCommissionAddress"
CASE_SEARCH_URL = "https://e-jagriti.gov.in/services/case/caseFilingService/v2/getCaseDetailsBySearchType"

@router.get("/states")
async def get_states():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(STATES_URL, headers=HEADERS)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=resp.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/commissions")
async def get_commissions(commissionId: str = Query(..., description="Commission ID from state data")):
    """
    Example: /commissions?commissionId=11350000
    """
    url = f"{COMMISSIONS_URL}?commissionId={commissionId}"

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, headers=HEADERS)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=resp.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/commission-address")
async def get_commission_address(commissionId: str = Query(..., description="Commission ID from commissions data")):
    """
    Example: /commission-address?commissionId=15290525
    """
    url = f"{ADDRESS_URL}?commissionId={commissionId}"

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, headers=HEADERS)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=resp.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.post("/case-search")
async def case_search(payload: dict = Body(...)):
    """
    Proxy for Jagriti case search.
    Expected payload example:
    {
      "commissionId": 15290525,
      "dateRequestType": 1,
      "fromDate": "2025-01-01",
      "toDate": "2025-08-29",
      "judgeId": "",
      "orderType": 1,
      "serchType": 4,
      "serchTypeValue": "Reddy"
    }
    """
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(CASE_SEARCH_URL, json=payload, headers={
                **HEADERS,
                "Origin": "https://e-jagriti.gov.in",
                "Content-Type": "application/json",
            })
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=resp.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
