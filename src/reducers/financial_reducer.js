const DEFAULT_STATE = {
    financeList: [
    {
        "north america": {
            "theatrical": {
                "gross": 0,
                "film rental": 0,
                "distribution fee": 0,
                "direct distribution expenses": 0,
                "distributor's net": 0
            },
            "home entertainment": {
                "gross": 0,
                "expenses": 0,
                "distribution fee": 0,
                "distributor's net": 0
            },
            "theatrical and home": {
                "sales agent fee": 0,
                "distributor's net": 0
            },
            "pay per view": {
                "gross": 0,
                "distribution fee": 0,
                "direct distribution expenses": 0,
                "sales agent fee": 0,
                "distributor's net": 0
            },
            "premium cable": {
                "gross": 0,
                "distribution fee": 0,
                "direct distribution expenses": 0,
                "sales agent fee": 0,
                "distributor's net": 0
            },
            "free tv premiere": {
                "gross": 0,
                "distribution fee": 0,
                "direct distribution expenses": 0,
                "sales agent fee": 0,
                "distributor's net": 0
            },
            "cable and syndicated tv": {
                "gross": 0,
                "distribution fee": 0,
                "direct distribution expenses": 0,
                "sales agent fee": 0,
                "distributor's net": 0
            },
            "total net earnings": 0
        },
        "international": {
            "theatrical, home, tv gross": 0,
            "sales agent fee": 0,
            "total net earnings": 0
        },
        "global consumer products": {
            "royalties gross": 0,
            "merchandising distribution fee": 0,
            "sales agent fee": 0,
            "distributor's net": 0
        },
        "total distributor's net": 0,
        "global brand tie-in fees": 0,
        "production financing expense": 0,
        "negative cost": 0,
        "studio burden": 0,
        "talent residuals": 0,
        "sales agent direct sales expenses": 0,
        "producer's gross": 0,
        "talent participation": 0,
        "producer's net": 0,
        "studio's share": 0,
        "producer's share": 0,
        "distributor's net earning to cost ratio": "0:0",
        "expenses after distributor's net": 0
    }
]
};

const financialReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type){
    case 'GET_FINANCIAL_DATA':
      return {financeList: action.payload.data.data}
    default:
      return state
  }
};

export default financialReducer;