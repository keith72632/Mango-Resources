/*
 * Pass the variable(key) for data point established in the Meta Data Point tab to 
 * this function. This can only take 'actual' data points. Can not take other Meta 
 * points.
 */
function get_last_value(dpoint)
{
    var list = [];
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var mgd = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var gpm = mgd_to_gpm(mgd);
    return mgd;
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


//gets the amount of fluoride fed within the last 24 hours in pounds.
function fluoride_used(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var first_int = float_to_int(first);
    print("First value: " + first_int);
    var last_int = float_to_int(last);
    print("Last Value: " + last_int);
    var result = (first_int - last_int);
    print("Result: " + result);   
    if(result > 0)
    {
        return result;
    } else {
        return 0;
    }
}

function lime_used(dpoint, concentration)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1441; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    var firstFixed = Number(first.toFixed(2));
    print("First Reading Fixed: " + firstFixed);
    var lastFixed = Number(last.toFixed(2));
    print("Last Reading Fixed: " + lastFixed);
    var result = (firstFixed - lastFixed);
    var resultFixed = Number(result.toFixed(2));
    print("Result Fixed: " + resultFixed);
    var final = (((resultFixed * 587) * 10.5) * concentration);
    
    if(final > 0)
    {
        print("Final Result Fixed: " + Number(final.toFixed(2)));
        return Number(final.toFixed(0));
    }
    else
    {
        return 0;
    }
}

//This is the last fluoride weight value registered(T00:00)
function chem_level(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
 
    return last;
}


//Calculates the amount of ammonia fed for the previous 24 hours
function ammonia_used(finish_meter, chlorine_res)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1441; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var first_fin_reading = finish_meter.getStats(start.getTime(), fin.getTime()).firstValue;
    var last_fin_reading = finish_meter.getStats(start.getTime(), fin.getTime()).lastValue;
    
    var firstFixed = Number(first_fin_reading.toFixed(2));
    print("First Finish Flow Value Fixed: " + firstFixed);
    var lastFixed = Number(last_fin_reading.toFixed(2));
    print("Last Finish Flow Value Fixed: " + lastFixed);
    var finish_flow_total = (lastFixed - firstFixed) / 1000;
    var finishFixed = Number(finish_flow_total.toFixed(2));
    print("Finished Flow Total: " + finishFixed);
    
    var chlorine_avg = chlorine_res.getStats(start.getTime(), fin.getTime()).average;
    var chlorineFixed = Number(chlorine_avg.toFixed(2));
    print("Chlorine Avg Fixed: " + chlorineFixed);
    var ammonia_total =(finishFixed * chlorineFixed * 8.34) / 3;
    print("Ammonia Total Fixed: " + ammonia_total.toFixed(2));
    return Number(ammonia_total.toFixed(2));

}

//Calculates the amount of chlorine fed during previous 24 hours
function chlorine_used(dpoint, residual)
{
    var flow = total_flow(dpoint);
    print("Flow: " + flow);
    
    var chlorine = flow * residual * 8.34;
    var clFixed = Number(chlorine.toFixed(0));
    print("Chlorine Used: " + clFixed);
    return clFixed;
}

function get_chlorine_low(dpoint, min)
{
    var cl_list = [];
    var minFixed = Number(min.toFixed(2));
    var fin = new Date();
    var day_range = (1000 * 60) * 1441; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var chlorine_readings = dpoint.pointValuesBetween(start.getTime(), fin.getTime());
    
    // for(var i = 0; i < chlorine_readings.length - 1; i++)
    // {
    //     // print(chlorine_readings[i].value);
    //     if(chlorine_readings[i].value > minFixed){
    //         cl_list.push(chlorine_readings[i].value);
    //     }
    // }
    
    // //find lowest
    // var lowest = cl_list[0];
    // for(var i = 0; i < cl_list.length - 1; i++)
    // {
    //     if(cl_list[i] < cl_list[i+1]){
    //         lowest == cl_list[i];
    //         print("cl_list[i]: " + cl_list[i] + " cl_list[i+1]: " + cl_list[i+1] + "lowest: " + lowest);
    //     }
    // }
    // print("Lowest Reading: " + lowest);
    var chlorine_low = dpoint.getStats(start.getTime(), fin.getTime()).minimumValue;
    
    return Number(chlorine_low.toFixed(2));
}

//Calculates the amount of chlorine fed during previous 24 hours
function pac_used(dpoint, dosage)
{
    var flow = total_flow(dpoint);
    print("Raw Flow: " + flow);
    print("PAC dosage: " + dosage);
    
    var result = flow * dosage * 8.34;
    return Number(result.toFixed(0));
}

//Lowest clearwell reading over 24 hour period
function clearwell_low(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var low = dpoint.getStats(start.getTime(), fin.getTime()).minimumValue;
    return Number(low.toFixed(1));
}

//calculates the total flow for any given meter during previous 24 hours
function total_flow(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1441; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var first_reading = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    print("Previous Meter Reading: " + Number(first_reading.toFixed(0)));
    var last_reading = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    print("Meter Reading: " + Number(last_reading.toFixed(0)));
    
    var flow_total = (last_reading - first_reading) / 1000;
    return Number(flow_total.toFixed(3));
}

function hours_run(dpoint)
{
    var list = [];
    var minutes = 0;
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var vals = dpoint.pointValuesBetween(start.getTime(), fin.getTime());
    
    for(var i = 0; i < vals.length; i++)
    {
        var time = parseInt(vals[i].value)
        if(time)
        {
            minutes++;
        }
    }
    print('Minutes' + minutes);
    var result = Number(minutes / 60).toFixed(0.25);
    print(result);
    return result;
}

/**********************************************************************
 *                      Utility Functions                             *
 **********************************************************************/
 
 function mgd_to_gpm(value)
{
    return (value * 1000000) / 1440;
}

function float_to_int(dec_num)
{
    var str = dec_num.toString();
    var whole_num = str.split('.');
    return parseInt(whole_num[0]);
}

//returns data point's lowest value for previous day
function get_prev_low(dpoint)
{
    var end = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    end.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(end.getTime() - day_range);

    var low = dpoint.getStats(start.getTime(), end.getTime()).minimumValue;
    return Number(low.toFixed(1));
}

//returns average for data point during previous 24 hours
function get_prev_avg(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);
    
    var chlorine_avg = dpoint.getStats(start.getTime(), fin.getTime()).average;
    
    return chlorine_avg;
}

function get_total_usage(west_station, east_station, berryville, hailey, green_forest)
{
    print("West station " + west_station.value);
    print("East station " + east_station.value);
    print("Berryville Meter " + berryville.value);
    print("Hailey road " + hailey.value);
    print("Green forest " + green_forest.value);
    
    var total = west_station.value + east_station.value + berryville.value + hailey.value + green_forest.value;
    return total;
}

function leak_detection_pre_pinemountain(fin_flow, total_usage, pine_mountain_flow)
{
    print('Finished Flow ' + fin_flow.value);
    print('Total Usage ' + total_usage.value);
    print('Pine Mountain Intake ' + pine_mountain_flow.value);
    var flag;
    if(fin_flow.value > total_usage.value && pine_mountain_flow === 0)
    {
        flag = 1;
        return true;
    }
    else
    {
        flag = 0;
        return false;
    }
}

function get(dpoint)
{
    return dpoint.value;
}

function bw_pump_meter(dpoint)
{
    var cnt = 0;
    var res;
    while(dpoint.value)
    {
        cnt ++;
        setTimeout(function(cnt){ cnt++; }, 1000);
    }
    res = cnt * 66.6;
    return res.toFixed(0);
}

function get_gpm(flow)
{
    print('Flow gpm = ' + flow.value);
    var gpm = (flow.value * 1000000) / 1440;
    print('GPM = ' + gpm);
    return gpm;
}

function get_drawdown(feet)
{
    return feet.value * 2693;
}

function get_three_filters(time, flow)
{
    var f = get_gpm(flow);
    var res = ((f * time.value) * 4) / 3;
    print('Three Filters' + res);
    return res;
}

function get_backwashed(time)
{
    return time.value * 4000;
}

function backwash_total(time, flow, feet)
{
    var backwashed = get_backwashed(time);
    var used = get_three_filters(flow, time); 
    var drawdown = get_drawdown(feet);
    return backwashed + used + drawdown;
}

function increment(dpoint)
{
    print("Before" + dpoint.value);
    RuntimeManager.refreshDataPoint(dpoint);
    print("After" + dpoint.value);
}

function generator_status(val)
{
    var status = Number(val.toFixed(0));
    if(status === 0){
        print("INITIALIZATION " + status);
        return "INITIALIZATION";
    } else if(status === 1) {
        print("PRE-CRANK" + status);
        return "PRE-CRANK";
    } else if(status === 2) {
        print("STARTING" + status);
        return "STARTING";
    } else if(status === 3) {
        print("RUNNING" + status);
        return "RUNNING";
    } else if(status === 4) {
        print("PRE-COOLDOWN" + status);
        return "PRE-COOLDOWN";
    } else if(status === 5) {
        print("COOLDOWN" + status);
        return "COOLDOWN";
    } else if(status === 6) {
        print("STOPPING" + status);
        return "STOPPING";
    } else if(status === 7) {
        print("STOPPED" + status);
        return "STOPPED";
    } else if(status === 8) {
        print("IDLING" + status);
        return "IDLING";
    }
    else {
        print("No status message" + status);
        return "ERROR";
    }
}

function breaker_status(val)
{
    var status = Number(val.toFixed(0));
    if(status === 0){
        print("OPEN " + status);
        return "OPEN";
    } else if(status === 1) {
        print("CLOSED" + status);
        return "CLOSED";
    } else if(status === 2) {
        print("TRIPPED" + status);
        return "TRIPPED";
    }
    else {
        print("No status message" + status);
        return "ERROR";
    }
}

function get_bd_time(dp)
{
    var seconds = dp.value / 1.667;
    print(seconds / 60);
    return seconds / 60;
}

function get_daily_dif(dpoint)
{
    var fin = new Date();
    var day_range = (1000 * 60) * 1440; //24 hours
    fin.setHours(0, 0, 0 , 0); //sets end of range to midnight
    
    var start = new Date(fin.getTime() - day_range);

    var first = dpoint.getStats(start.getTime(), fin.getTime()).firstValue;
    print("first: " + first);
    // print(dpoint.getStats(start.getTime(), fin.getTime()));
    var last = dpoint.getStats(start.getTime(), fin.getTime()).lastValue;
    print("last:" +last);
    var result = (last - first);
    print("Result: " + result);   
    
    return result;

}
function total_discharge_west(val)
{
    var temp = val * 1982;
    return temp.toFixed(0);
}

function total_discharge_east(val)
{
    var temp = val * 1500;
    return temp.toFixed(0);
}

function get_average(dpoint)
{
    var end = new Date();
    var start = new Date(end.getTime() - (1000 * 60 * 1440));
    var stats = dpoint.getStats(start.getTime(), end.getTime());
    print(stats);
    var average = stats.average;
    print("Average = " + average);
    return average;
}

function breaker_status_bool(dpoint)
{
    if(dpoint){
        return true;
    } else {
        return false;
    }
}

function gen_running(dpoint){
    if(dpoint === 7) {
        return false;
    } else {
        return true;
    }
}

function main_bus_status(bkr1_status, bkr2_status, bkr3_status, bkr5_status){
    if(bkr1_status === 1 || bkr2_status === 1 || bkr3_status === 1 || bkr5_status === 1) {
        return true;
    } else {
        return false;
    }
}

function east_ats_status(dpoint) {
    if(dpoint.value){
        return "CLOSED";
    } else {
        return "OPEN";
    }
}

function high_turb_alarm(filter){
    if(filter.value >= 0.30){
        return true;
    } else {
        return false;
    }
}

function clearwell_low_alarm(level, low_sp){
    if(level.value <= low_sp.value){
        return true;
    } else {
        return false;
    }
}

function clearwell_high_alarm(level, high_sp){
    if(level.value >= high_sp.value){
        return true;
    } else {
        return false;
    }
}

function chlorine_high_alarm(chlorine){
    if(chlorine.value >= 3.50){
        return true;
    }else{
        return false;
    }
}

function chlorine_low_alarm(chlorine){
    if(chlorine.value <= 0.50){
        return true;
    }else{
        return false;
    }
}

function high_pressure_alarm(pressure, const_limit){
    if(pressure.value >= const_limit){
        return true;
    } else {
        return false;
    }
}
/*
Takes the actual ammonia feed rate and compares it to desired ammonia feed rate. If the actual feed rate out of the desired range
determined by the const_range_factor (percentage represented in decimal), then returns true
*/
function nh3_alarm(feed_rate, free_cl2_residual, finish_flow, const_range_factor, ratio){
    var correct_feed_rate = (free_cl2_residual.value * finish_flow.value * 8.34) / ratio.value;
    print("Correct Feed Rate " + correct_feed_rate);
    print("Actual Feed Rate " + feed_rate.value);
    var range = correct_feed_rate * const_range_factor;
    print("Range " + (correct_feed_rate + range) + " to " + (correct_feed_rate - range));
    if(feed_rate.value >= (correct_feed_rate + range) || feed_rate.value <= correct_feed_rate - range) {
        return true;
    } else {
        return false;
    }
}

function high_alarm(dpoint, const_level){
    if(dpoint.value >= const_level){
        return true;
    } else {
        return false;
    }
}

function low_alarm(dpoint, const_level){
    if(dpoint.value <= const_level){
        return true;
    } else {
        return false;
    }
}
function low_oil_pressure_alarm(gen_status, oil_press, const_level){
    if(gen_status.value === 3 && oil_press.value <= const_level) {
        return true;
    } else {
        return false;
    }
}