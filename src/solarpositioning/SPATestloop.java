package solarpositioning;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class SPATestloop {

	public static void main(final String[] args) {
		double az, ze;
		for (int hour = 1; hour < 24; hour++) {
			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-6 * 60 * 60 * 1000, "LST"));
			time.set(2015, Calendar.JUNE, 19, hour, 00, 00);
			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, 30.25, -97.75, 1830.14, 67, 820, 11);
			az = result.getAzimuth();
			ze = -(result.getZenithAngle() - 90);
			 String s = String.format("%-12d%-12.5f%.20f", hour,az,ze);
			System.out.println(s);
		}
	}

}
