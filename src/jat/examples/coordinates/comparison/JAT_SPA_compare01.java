package jat.examples.coordinates.comparison;

import jat.core.coordinates.Angle;
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

		// System.out.println(month);

		s = String.format("%-4s%-7s%-12s", "hr", "az", "HA(hours)");
		System.out.println(s);
		for (int hour = 0; hour < 24; hour++) {
			// System.out.println("hour " + hour);

			// GregorianCalendar time = new GregorianCalendar(new
			// SimpleTimeZone(0 * 60 * 60 * 1000, "LST"));
			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));

			time.set(year, month, day, hour, minute, second);

			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, latitude, longitude, elevation, 67, 820, 11);

			// System.out.println("azimuth " + result.getAzimuth());
			// System.out.println("altitude " + (90 - result.getZenithAngle()));

			ReferenceFrame rf = new ReferenceFrame();
			DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
			DateTime currentDateTime = new DateTime(year, month + 1, day, hour, 0);
			// DateTime dt = new DateTime(2004, 7, 27, 0, 0);
			rf.sunPosition(epoch, currentDateTime);
			// rf.eclipticCoord.println();
			rf.eclipticToEquatorial(currentDateTime);
			// rf.equatorialCoord.println();
			rf.equatorialCoord.RA.println("RA", Angle.DEGREES);
			rf.equatorialCoord.dec.println("dec", Angle.DEGREES);
			rf.equatorialToHorizon(hour);
			// rf.horizontalCoord.println();

			t = String.format("%-4d%-6.2f%-12.5f", hour, result.getAzimuth(), 1.);
			System.out.println(t);

		}
	}

}
