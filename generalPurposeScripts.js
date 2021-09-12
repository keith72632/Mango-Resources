/*
 * Pass the variable(key) for data point established in the Meta Data Point tab to 
 * this function. This can only take 'actual' data points. Can not take other Meta 
 * points.
 */

function getMidnightValue(dpoint)
{
    var list = [];
    var start = new Date();
    var fin = new Date();
    start.setHours(0, 0, 0, 0);
    fin.setHours(0, 1, 0, 0);
    list = dpoint.pointValuesBetween(start.getTime(), fin.getTime());
    return list[0];
}

/*
 * Logs the max flow in gallons per minute starting from 00:00 hours to current
 */
function getPeakFlow(dpoint)
{
    var list = [];
    var start = new Date();
    var fin = Date.now();
    start.setHours(0, 0, 0 , 0);
    var mgd = dpoint.getStats(start.getTime(), fin).maximumValue;
    var gpm = (mgd * 1000000) / 1440;
    return gpm;
}
