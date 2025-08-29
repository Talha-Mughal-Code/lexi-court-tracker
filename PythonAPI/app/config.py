import os
from dotenv import load_dotenv

load_dotenv()

JAGRITI_BASE = os.getenv("JAGRITI_BASE", "https://e-jagriti.gov.in")
# endpoints (kept configurable)
GET_STATE_COMMISSION = os.getenv("JAGRITI_ST_COM", f"{JAGRITI_BASE}/services/report/report/getStateCommissionAndCircuitBench")
GET_CASES_BY_SEARCH = os.getenv("JAGRITI_CASES", f"{JAGRITI_BASE}/services/case/caseFilingService/v2/getCaseDetailsBySearchType")

# default date window (days)
DEFAULT_DATE_RANGE_DAYS = int(os.getenv("DEFAULT_DATE_RANGE_DAYS", "30"))
