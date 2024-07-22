const filterViewsByTimeFrame = (views, timeFrame) => {
    const now = new Date();
    let startDate;
  
    switch (timeFrame) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'all':
      default:
        return views.length;
    }
  
    return views.filter(view => view >= startDate).length;
  };
  
  module.exports = {
    filterViewsByTimeFrame
  };