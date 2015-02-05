package jat.tests.core.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroCoordinate;
import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.AstroUtil;
import jat.core.coordinates.solarPositioning.AzimuthZenithAngle;
import jat.core.coordinates.solarPositioning.SPA;


import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;


public class SPAmodTest02 {
	public class dataSet {
		int timeZoneOffset;
		String timeZoneString;
		int year;
		int month;
		int day;
		int hour;
		int minute;
		int second;
		double latitude;
		double longitude;

		public dataSet(int timeZoneOffset, String timeZoneString, int year, int month, int day, int hour, int minute,
				int second, double latitude, double longitude, double elevation) {

			this.timeZoneOffset = timeZoneOffset;
			this.timeZoneString = timeZoneString;
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
	public static void main(String[] args) {
		String s, t;
		SPAmodTest02 jsp = new SPAmodTest02();
		dataSet ds;

		dataSet Greenwich = jsp.new dataSet(0,"UTC", 1980, 1, 27, 12, 0, 0, 52., 0., 1830.14);
		dataSet Austin = jsp.new dataSet(-6, "CST6CDT",2015, 2, 2, 12, 0, 0, 30., -97., 1830.14);
		ds = Greenwich;
		ds = Austin;

		// System.out.println(month);
		System.out.println("Sun Position SPA with Joda time vs. JAT");
		s = String.format("TimeZone %8s offset %3d date %2d/%2d/%4d lat %-6.2f lon %-6.2f",ds.timeZoneString, ds.timeZoneOffset, ds.month + 1,
				ds.day, ds.year, ds.latitude, ds.longitude);
		System.out.println(s);

		s = String.format("%-4s%-8s%-8s%-10s%-8s%-8s%-8s%-8s%-8s%-8s%-8s", "hr", "GST", "RA", "RA(h)", "dec", "az",
				"alt", "RA", "dec", "az", "alt");
		System.out.println(s);
		for (int hour = 0; hour < 24; hour++) {
			Angle longitude = new Angle(ds.longitude, Angle.DEGREES);
			Angle latitude = new Angle(ds.latitude, Angle.DEGREES);
			AstroDateTimeLocation adt = new AstroDateTimeLocation(ds.year, ds.month , ds.day, hour, ds.minute, ds.second, ds.timeZoneString,
					longitude,latitude);

			AzimuthZenithAngle result = SPA.calculateSolarPosition(adt, ds.latitude, ds.longitude, ds.elevation, 67,
					820, 11);
			double SPAnu = SPA.getNuDegrees();
			double SPARA = SPA.getAlphaDegrees();
			double SPARAhdec = SPARA / 15;
			double tmpminutes = 60. * AstroUtil.Frac(SPARAhdec);
			String SPARAh = String.format("%2d:%2d:%2d", (int) SPARAhdec, (int) (60. * AstroUtil.Frac(SPARAhdec)),
					(int) (60. * AstroUtil.Frac(tmpminutes)));
			double SPAdec = SPA.getDeltaDegrees();
			double SPAaz = result.getAzimuth();
			double SPAalt = 90 - result.getZenithAngle();

			AstroCoordinate ac = new AstroCoordinate();
			DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
			DateTime currentDateTime = new DateTime(ds.year, ds.month , ds.day, hour, 0);
			ac.sunPositionDS(epoch, currentDateTime);
			ac.eclipticToEquatorial(currentDateTime);
			double acRA = ac.equatorialCoord.RA.getDegrees();
			double acdec = ac.equatorialCoord.dec.getDegrees();
			ac.equatorialToHorizonDS(adt);
			double acaz = ac.horizontalCoord.azimuth.getDegrees();
			double acalt = ac.horizontalCoord.altitude.getDegrees();

			String tf = "%-4d%-8.2f%-8.2f%-10s%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f%-8.2f";
			t = String.format(tf, hour, SPAnu, SPARA, SPARAh, SPAdec, SPAaz, SPAalt, acRA, acdec, acaz, acalt);
			System.out.println(t);

		}

	}
}
