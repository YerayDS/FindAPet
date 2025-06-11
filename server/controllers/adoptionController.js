import AdoptionCounter from "../models/AdoptionCounter.js";

export const getAdoptionCount = async (req, res) => {
  try {
    let counter = await AdoptionCounter.findOne();
    if (!counter) {
      counter = new AdoptionCounter();
      await counter.save();
    }
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementAdoptionCount = async (req, res) => {
  try {
    let counter = await AdoptionCounter.findOne();
    if (!counter) {
      counter = new AdoptionCounter();
    }
    counter.count += 1;
    await counter.save();
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
