package com.commercebank.www.service.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.temporal.TemporalAdjusters;

/**
 * Created by Steven on 4/20/2016.
 */
public class BusinessDayUtil
{
    /*Test*/
    public static void main(String args[])
    {
        LocalDate date1 = LocalDate.now();
        int days = 3;
        System.out.println("Date 1: " + date1.toString() + " Number of days to add: " + days);

        //LocalDate date2 = LocalDate.of(2016, Month.SEPTEMBER, 19);
        LocalDate date2 = LocalDate.from(addBusinessDays(date1, new Long(days)));
        System.out.println("Date 2: " + date2.toString());
    }

    /**
     * Calculate a new date by adding business days to the given date.
     * @params earlier, later
     * @return Temporal
     */
    public static LocalDate addBusinessDays(LocalDate date, Long numDays)
    {
        LocalDate earlier = date;
        LocalDate later = earlier.plusDays(numDays);

        //Check if weekend
        LocalDate start = earlier;
        while (start.compareTo(later) <= 0)
        {
            if (start.getDayOfWeek() == DayOfWeek.SATURDAY)
            {
                later = later.plusDays(1);
                start = start.plusDays(1);
            }
            else if (start.getDayOfWeek() == DayOfWeek.SUNDAY)
            {
                later = later.plusDays(1);
                start = start.with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
            }
            else
                start = start.with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
        }

        //Check if New Year's Day
        if (earlier.compareTo(LocalDate.of(later.getYear(), Month.JANUARY, 1)) <= 0
            && later.compareTo(LocalDate.of(later.getYear(), Month.JANUARY, 1)) >= 0)
            later = later.plusDays(1);

        //Check if Christmas Day
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.DECEMBER, 25)) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.DECEMBER, 25)) >= 0)
            later = later.plusDays(1);

        //Check if 4th of July
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.JULY, 4)) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.JULY, 4)) >= 0)
            later = later.plusDays(1);

        //Check Thanksgiving Day (4th Thursday of November)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.NOVEMBER, 1).with(TemporalAdjusters.dayOfWeekInMonth(4, DayOfWeek.THURSDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.NOVEMBER, 1).with(TemporalAdjusters.dayOfWeekInMonth(4, DayOfWeek.THURSDAY))) >= 0)
            later = later.plusDays(1);

        //Check Memorial Day (last Monday of May)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.MAY, 1).with(TemporalAdjusters.lastInMonth(DayOfWeek.MONDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.MAY, 1).with(TemporalAdjusters.lastInMonth(DayOfWeek.MONDAY))) >= 0)
            later = later.plusDays(1);

        //Check Labor Day (1st Monday of September)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.SEPTEMBER, 1).with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.SEPTEMBER, 1).with(TemporalAdjusters.firstInMonth(DayOfWeek.MONDAY))) >= 0)
            later = later.plusDays(1);

        //Check President's Day (3rd Monday of February)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.FEBRUARY, 1).with(TemporalAdjusters.dayOfWeekInMonth(3, DayOfWeek.MONDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.FEBRUARY, 1).with(TemporalAdjusters.dayOfWeekInMonth(3, DayOfWeek.MONDAY))) >= 0)
            later = later.plusDays(1);

        //Check Veterans Day (November 11)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.NOVEMBER, 11)) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.NOVEMBER, 11)) >= 0)
            later = later.plusDays(1);

        //Check MLK Day (3rd Monday of January)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.JANUARY, 1).with(TemporalAdjusters.dayOfWeekInMonth(3, DayOfWeek.MONDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.JANUARY, 1).with(TemporalAdjusters.dayOfWeekInMonth(3, DayOfWeek.MONDAY))) >= 0)
            later = later.plusDays(1);

        //Check Columbus Day (2nd Monday in October)
        if (earlier.compareTo(LocalDate.of(earlier.getYear(), Month.OCTOBER, 1).with(TemporalAdjusters.dayOfWeekInMonth(2, DayOfWeek.MONDAY))) <= 0
            && later.compareTo(LocalDate.of(earlier.getYear(), Month.OCTOBER, 1).with(TemporalAdjusters.dayOfWeekInMonth(2, DayOfWeek.MONDAY))) >= 0)
            later = later.plusDays(1);

        //IF NOTHING ELSE, IT'S A BUSINESS DAY

        if (later.getDayOfWeek() == DayOfWeek.SATURDAY || later.getDayOfWeek() == DayOfWeek.SUNDAY)
            later =  later.with(TemporalAdjusters.next(DayOfWeek.MONDAY));

        return later;
    }
}
