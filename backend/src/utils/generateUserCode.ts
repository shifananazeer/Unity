import { Counter } from "../models/Counter";

export const getNextUserCode = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: "userCode" },          // unique counter name
    { $inc: { value: 1 } },        // increment by 1
    { new: true, upsert: true }    // create if not exists
  );

  return `UDC${counter.value}`;
};