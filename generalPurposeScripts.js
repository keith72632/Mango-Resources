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
        return Number(final.toFixed(2));
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
    return (minutes / 60);
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