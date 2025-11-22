from datetime import datetime, timedelta

def prediction(last_period: str, cycle_type: str, period_duration: int):
    cycle_type = cycle_type.lower().strip()
    if cycle_type == "short":
        cycle_length = 24
    elif cycle_type == "normal":
        cycle_length = 28
    elif cycle_type == "long":
        cycle_length = 36
    else:
        return {"error": "Invalid cycle type. Use 'short', 'normal', or 'long'."}
    
    try:
        last_period_date = datetime.strptime(last_period, "%Y-%m-%d")  # year-month-day format
    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD."}
    next_period = last_period_date + timedelta(days=cycle_length) 
    ovulation = last_period_date + timedelta(days=(cycle_length // 2))  # Mid-cycle
    luteal_start = ovulation + timedelta(days=1)
    luteal_done = next_period - timedelta(days=1)
    period_done = last_period_date + timedelta(days=period_duration - 1)

    return {
        "next_period": next_period.date(),
        "ovulation": ovulation.date(),
        "luteal_phase": {
            "start": luteal_start.date(),
            "end": luteal_done.date()
        },
        "period": {
            "start": last_period_date.date(),
            "end": period_done.date()
        }
    }