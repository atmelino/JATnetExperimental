package jat.examples.coordinates;

import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;
import org.joda.time.chrono.GregorianChronology;


public class PractAstrTest04 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 04 Julian Day Numbers");
		
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID("UTC"));
		DateTime currentDateTime = new DateTime(1985, 2, 17,6, 0, chrono);
		
		long millis = currentDateTime.getMillis();
		double JD_cur = DateTimeUtils.toJulianDay(millis);
		System.out.println("Julian Day Number "+JD_cur);

	}
}
