import G from "../../config/G.js";
export default {
  GetUsageSettings: {
    Request(req) {  
    // no request demand,no need to deal with    
      return req;
    },
    Response(res) {
    // deal with the get data  
      res.TimeLimitTimes = String(res.TimeLimitTimes)
      if (res.Unit == 0) {
        res.MonthlyPlan = String(res.MonthlyPlan / 1024 / 1024);
      } else if (res.Unit == 1) {
        res.MonthlyPlan = String(res.MonthlyPlan / 1024 / 1024 / 1024);
      } else if (res.Unit == 2) {
        res.MonthlyPlan = String(res.MonthlyPlan / 1024);
      }
      return res;
    }
  },

  SetUsageSettings: {
    // deal with the settings data
    Request(req) {
      req = Object.assign({},req)
      req.MonthlyPlan = Number(req.MonthlyPlan)
      if (req.Unit == 0) {
        req.MonthlyPlan = req.MonthlyPlan * 1024 * 1024;
      } else if (req.Unit == 1) {
        req.MonthlyPlan = req.MonthlyPlan * 1024 * 1024 * 1024;
      } else if (req.Unit == 2) {
        req.MonthlyPlan = req.MonthlyPlan * 1024;
      }
      req.BillingDay = Number(req.BillingDay)
      req.UsedData = Number(req.UsedData)
      req.TimeLimitFlag = Number(req.TimeLimitFlag)
      req.TimeLimitTimes = Number(req.TimeLimitTimes)
      req.UsedTimes = Number(req.UsedTimes)
      req.AutoDisconnFlag = Number(req.AutoDisconnFlag)
      req.Unit = Number(req.Unit)
      return req;
    },
    Response(res) {
      return res;
    }
  }
}
