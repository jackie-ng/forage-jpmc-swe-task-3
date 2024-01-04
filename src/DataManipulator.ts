import { ServerRespond } from './DataStreamer';
// Update Row interface to match the schema in Graph.tsx
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
  //Calculating price_abc, price_def, upper_bound, lower_bound, ratio
  //upper_bound and lower_bound will be +- 5 percent, since doing ratio, 1 is 100 percent
     const price_abc = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
     const price_def = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
     const upper_bound = 1 + 0.05;
     const lower_bound = 1 - 0.05;
     const ratio = price_abc/price_def;
      return {
        price_abc,
        price_def,
        ratio,
        upper_bound,
        lower_bound,
        //Ternary Operator to have timestamp be more recent
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
        //Ternary Operator to have alert be set
        trigger_alert: (ratio > upper_bound || ratio < lower_bound)? ratio : undefined,
    };
  }
}
