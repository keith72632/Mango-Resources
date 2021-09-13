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
 * Logs the max flow in gallons per minute starting from $(date-1)T-00:00 to $(date)T-00:00. Operators will record this number
 * after clock hits midnight, so data must range from present time(00:00) to the midnight before.
 */
function getPeakFlow(dpoint)
{
    var list = [];
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight

    var start = new Date(fin.getTime() - day_range);

    var mgd = dpoint.getStats(start.getTime(), fin.getTime()).maximumValue;
    var gpm = mgd_to_gpm(mgd);
    return gpm;
}

function mgd_to_gpm(value)
{
    return (value * 1000000) / 1440;
}

function fluoride(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight

    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    return last;
}
