package jat.tests.core.coordinates;

import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.solarPositioning.JulianDateJoda;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import solarpositioning.JulianDate;

public class SPAmodTest01 {

	public static void main(String[] args) {
		String s, t;

		System.out.println("Test for SPA modified to use JodaTime instead of java.util");

		
		GregorianCalendar date = new GregorianCalendar(new SimpleTimeZone(-6 * 60 * 60 * 1000, "LST"));
		date.set(2015, Calendar.DECEMBER, 19, 22, 00, 00); 
		final JulianDate jdGreg = new JulianDate(date);

		AstroDateTimeLocation adt = new AstroDateTimeLocation(2015, 12, 19, 22, 0, 0, "CST6CDT");
		final JulianDateJoda jdJoda = new JulianDateJoda(adt);

		s = String.format("%-14s%-16s%-16s", "", "SPA Joda", "SPA java.util");
		System.out.println(s);
		t = String.format("%-14s%-16.6f%-16.6f", "JD", jdJoda.getJulianDate(), jdGreg.getJulianDate());
		System.out.println(t);
		
	}

}
