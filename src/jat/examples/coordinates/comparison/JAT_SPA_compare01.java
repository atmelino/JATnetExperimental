package jat.examples.coordinates.comparison;

import jat.core.coordinates.AstroCoordinate;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class JAT_SPA_compare01 {

	public class dataSet {
		int timeZoneOffset;
		int year;
		int month;
		int day;
		int hour;
		int minute;
		int second;
		double latitude;
		double longitude;

		public dataSet(int timeZoneOffset, int year, int month, int day, int hour, int minute, int second, double latitude, double longitude, double elevation) {

			this.timeZoneOffset = timeZoneOffset;
			this.year = year;
			this.month = month;
			this.day = day;
			this.hour = hour;
			this.minute = minute;
			this.second = second;
			this.latitude = latitude;
			this.longitude = longitude;
			this.elevation = elevation;
		}

		double elevation;

	}

	public static void main(final String[] args) {
		String s, t;
		JAT_SPA_compare01 jsp = new JAT_SPA_compare01();
		dataSet ds;

		dataSet Greenwich = jsp.new dataSet(0, 1980, Calendar.JANUARY, 27, 12, 0, 0, 52., 0., 1830.14);
		dataSet Austin = jsp.new dataSet(-6, 2015, Calendar.JANUARY, 31, 12, 0, 0, 30., -97., 1830.14);
		ds = Greenwich;
		ds = Austin;

		// System.out.println(month);
		System.out.println("Sun Position SPA vs. JAT");
		s = String.format("TimeZone %3d date %2d/%2d/%4d lat %-6.2f lon %-6.2f", ds.timeZoneOffset, ds.month+1,ds.day,ds.year,ds.latitude, ds.longitude);
		System.out.println(s);

		s = String.format("%-4s%-8s%-8s%-10s%-8s%-8s%-8s%-8s%-8s%-8s%-8s", "hr", "GST", "RA", "RA(h)", "dec", "az", "alt", "RA", "dec", "az", "alt");
		System.out.println(s);
		for (int hour = 0; hour < 24; hour++) {
			// System.out.println("hour " + hour);

			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(ds.timeZoneOffset * 60 * 60 * 1000, "LST"));
			time.set(ds.year, ds.month, ds.day, hour, ds.minute, ds.second);

			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, ds.latitude, ds.longitude, ds.elevation, 67, 820, 11);

			AstroCoordinate rf = new AstroCoordinate();
			DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
			DateTime currentDateTime = new DateTime(ds.year, ds.month + 1, ds.day, hour, 0);
			rf.sunPosition(epoch, currentDateTime);
			rf.eclipticToEquatorial(currentDateTime);
			// // rf.eclipticCoord.println();
			double rfRA = rf.equatorialCoord.RA.getDegrees();
			double rfdec = rf.equatorialCoord.dec.getDegrees();
			rf.equatorialToHorizon(ds.year, ds.month + 1, ds.day, hour, ds.minute, ds.second, ds.longitude, ds.latitude);
			// rf.equatorialCoord.RA.println();
			// rf.equatorialCoord.println();
			// rf.equatorialToHorizonDS(hour - 3.7, latitude);
			// rf.horizontalCoord.println();

			double SPAnu = SPA.getNuDegrees();
			double SPARA = SPA.getAlphaDegrees();
			// System.out.println(SPARA);
			double SPARAhdec = SPARA / 15;
			double tmpminutes = 60. * Frac(SPARAhdec);

			String SPARAh = String.format("%2d:%2d:%2d", (int) SPARAhdec, (int) (60. * Frac(SPARAhdec)), (int) (60. * Frac(tmpminutes)));
			// System.out.println(SPARAh);
			double SPAdec = SPA.getDeltaDegrees();
			double SPAaz = result.getAzimuth();
			double SPAalt = 90 - result.getZenithAngle();
			double rfaz = rf.horizontalCoord.azimuth.getDegrees();
			double rfalt = rf.horizontalCoord.altitude.getDegrees();

			// t =
			// String.format("%-4d%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f",
			// hour, SPA.getNuDegrees(), SPA.getAlphaDegrees(),
			// SPA.getDeltaDegrees(), result.getAzimuth(),
			// 90 - result.getZenithAngle(), rfRA, rfdec, rfaz, rfalt);
			String tf = "%-4d%-8.2f%-8.2f%-10s%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f";
			t = String.format(tf, hour, SPAnu, SPARA, SPARAh, SPAdec, SPAaz, SPAalt, rfRA, rfdec, rfaz, rfalt);
			System.out.println(t);

		}

	}

	private static double Frac(double x) {
		return x - Math.floor(x);
	}
}
