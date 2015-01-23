package solarpositioning;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class SPATestloop {

	public static void main(final String[] args) {

		double lat = 30.25;
		double az, alt;
		double dec, HA;
		String s = String.format("%-12s%-12s%-12s%-12s%-12s", "hour", "az", "alt", "dec", "HA");

		System.out.println(s);

		for (int hour = 1; hour < 25; hour++) {
			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-6 * 60 * 60 * 1000, "LST"));
			// time.set(2015, Calendar.JUNE, 19, hour, 00, 00);
			time.set(2015, Calendar.DECEMBER, 19, hour, 00, 00);
			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, lat, -97.75, 1830.14, 67, 820, 11);
			az = result.getAzimuth();
			alt = 90 - result.getZenithAngle();
			dec = Math.asin(Math.sin(alt) * Math.sin(lat) + Math.cos(alt) * Math.cos(lat) * Math.cos(az));
			HA = Math.acos((Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) / Math.cos(lat) * Math.cos(dec));
			//HA = 0.7;
			String t = String.format("%-12d%-12.5f%-12.5f%-12.5f%-12.5f", hour, az, alt, dec, HA);
			System.out.println(t);
		}
	}

}
