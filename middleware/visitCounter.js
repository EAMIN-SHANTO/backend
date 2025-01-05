import Visit from '../models/visit.model.js';

export const incrementVisitCount = async (req, res, next) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 0 });
    }
    visit.count += 1;
    await visit.save();
    next();
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    next();
  }
}; 