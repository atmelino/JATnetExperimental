package jat.examples.coordinates.comparison;

import jat.core.coordinates.ReferenceFrame;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class JAT_SPA_compare01 {

	public static void main(final String[] args) {
		int year = 1980;
		int month = Calendar.JULY;
		int day = 27;
		// int hour = 12;
		int minute = 0;
		int second = 0;
		double latitude = 52.;
		double longitude = 0.;
		double elevation = 1830.14;
		String s, t;

//		year = 2015;
//		month = Calendar.JANUARY;
//		day=28;
//		latitude=30.;
//		longitude=-97;
		
		// System.out.println(month);
		System.out.println("SPA vs. JAT");

		s = String.format("%-4s%-8s%-8s%-8s%-8s%-8s%-8s%-8s%-8s%-8s", "hr", "GST", "RA", "dec", "az", "alt", "RA",
				"dec", "az", "alt");
		System.out.println(s);
		for (int hour = 0; hour < 24; hour++) {
			// System.out.println("hour " + hour);

			// GregorianCalendar time = new GregorianCalendar(new
			// SimpleTimeZone(0 * 60 * 60 * 1000, "LST"));
			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));
			time.set(year, month, day, hour, minute, second);

			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, latitude, longitude, elevation, 67, 820, 11);

			ReferenceFrame rf = new ReferenceFrame();
			DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
			DateTime currentDateTime = new DateTime(year, month + 1, day, hour, 0);
			rf.sunPosition(epoch, currentDateTime);
			rf.eclipticToEquatorial(currentDateTime);
			// // rf.eclipticCoord.println();
			double rfRA = rf.equatorialCoord.RA.getDegrees();
			double rfdec = rf.equatorialCoord.dec.getDegrees();
			rf.equatorialToHorizon(year, month + 1, day, hour, minute, second, longitude, latitude);
			// //rf.equatorialCoord.println();
			//rf.equatorialToHorizonDS(hour - 3.7, latitude);
			// rf.horizontalCoord.println();

			double rfaz = rf.horizontalCoord.azimuth.getDegrees();
			double rfalt = rf.horizontalCoord.altitude.getDegrees();

			t = String.format("%-4d%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f", hour, SPA.getNuDegrees(),
					SPA.getAlphaDegrees(), SPA.getDeltaDegrees(), result.getAzimuth(), 90 - result.getZenithAngle(),
					rfRA, rfdec, rfaz, rfalt);
			System.out.println(t);

		}
	}
}
