# importing FastAPI and Query from fastapi, and prediction from prediction module
from fastapi import FastAPI, Query
from prediction import prediction
#initializing the app
#asking fastapi to start a new web project
app = FastAPI()

#basic route
@app.get("/")
def welcome():
    return {"HIIEE":"Welcome to the PeriodTracker API :P"}

@app.get("/prediction")
def predict(
    last_period: str = Query(..., description = "Last period date please (YYYY-MM-DD):"),
    cycle_type: str = Query(...,  description = """Cycle type please:
                                                  short(21-24)
                                                  normal(25-35)
                                                  long(35+)"""),
    period_duration: int = Query(..., description = "Days your period usually lasts please:")

):
    if cycle_type == "short":
        true_cycle_length = 24
    elif cycle_type == "normal":
        true_cycle_length = 28
    elif cycle_type == "long":
        true_cycle_length = 36
    else:
        true_cycle_length = 28

    result = prediction(last_period, true_cycle_length, period_duration)
    return result