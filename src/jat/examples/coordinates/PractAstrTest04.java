package jat.examples.coordinates;

import java.util.Calendar;
import java.util.GregorianCalendar;

import jat.core.coordinates.AstroDateTime;

import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;
import org.joda.time.chrono.GregorianChronology;

public class PractAstrTest04 {

	public static void main(final String[] args) {
		String s, t;
		Chronology chrono;
		DateTime currentDateTime;
		long millis;
		double JD_joda1, JD_joda2;

		System.out.println("Practical Astronomy 04 Julian Day Numbers");

		chrono = GregorianChronology.getInstance(DateTimeZone.forID("UTC"));
		currentDateTime = new DateTime(1985, 2, 17, 6, 0, chrono);
		millis = currentDateTime.getMillis();
		JD_joda1 = DateTimeUtils.toJulianDay(millis);
		// System.out.println("Julian Day Number "+JD_joda);

		GregorianCalendar gc = new GregorianCalendar(1985, Calendar.FEBRUARY, 17, 6, 0);
		AstroDateTime adt = new AstroDateTime(gc);

		chrono = GregorianChronology.getInstance(DateTimeZone.forID("EST"));
		currentDateTime = new DateTime(1985, 2, 17, 6, 0, chrono);
		millis = currentDateTime.getMillis();
		JD_joda2 = DateTimeUtils.toJulianDay(millis);

		
		
		s = String.format("%-24s%-12s%-12s%-12s", "", "Expected", "Joda", "Astro");
		System.out.println(s);
		t = String.format("%-24s%-12.2f%-12.2f%-12.2f", "2/17/1985 17:06:00 UT", 2446113.75, JD_joda1, adt.getJD());
		System.out.println(t);
		t = String.format("%-24s%-12.2f%-12.2f%-12.2f", "2/17/1985 17:06:00 EST", 2446113.75, JD_joda2, adt.getJD());
		System.out.println(t);

	}
}
