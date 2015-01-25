package solarpositioning;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import org.apache.commons.math3.geometry.euclidean.threed.SphericalCoordinates;
import org.apache.commons.math3.geometry.euclidean.threed.Vector3D;

import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class SPATestloop {

	public static void main(final String[] args) {

		double lat = 30.25;
		double latRad;
		double az, zen, alt;
		double azRad, zenRad, altRad;
		double decRad, HA;
		String t;

		// String s = String.format("%-12s%-12s%-12s%-12s%-12s", "hour", "az",
		// "alt", "dec", "HA");
		String s = String.format("%-12s%-12s%-12s%-12s%-12s%-12s%-12s", "hour", "az", "zen", "alt", "x", "y", "z");
		System.out.println(s);

		for (int hour = 1; hour < 25; hour++) {
			GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-6 * 60 * 60 * 1000, "LST"));
			// time.set(2015, Calendar.JUNE, 19, hour, 00, 00);
			time.set(2015, Calendar.JUNE, 19, hour, 00, 00);
			AzimuthZenithAngle result = SPA.calculateSolarPosition(time, lat, -97.75, 1830.14, 67, 820, 11);
			az = result.getAzimuth();
			zen = result.getZenithAngle();
			alt = 90 - result.getZenithAngle();
			azRad = Math.toRadians(az);
			zenRad = org.apache.commons.math3.util.FastMath.toRadians(zen);
			altRad = org.apache.commons.math3.util.FastMath.toRadians(alt);
			latRad = org.apache.commons.math3.util.FastMath.toRadians(lat);

			decRad = Math.asin(Math.sin(altRad) * Math.sin(latRad) + Math.cos(altRad) * Math.cos(latRad) * Math.cos(azRad));
			HA = Math.acos((Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / Math.cos(latRad) * Math.cos(decRad));
			// HA = 0.7;
			// String t = String.format("%-12d%-12.5f%-12.5f%-12.5f%-12.5f",
			// hour, az, alt, dec, HA);
			// System.out.println(t); azRad =
			// org.apache.commons.math3.util.FastMath.toRadians(az);

			SphericalCoordinates rs = new SphericalCoordinates(100, azRad, zenRad);
			Vector3D r = rs.getCartesian();
			double x = r.getX();
			double y = r.getY();
			double z = r.getZ();

			// t = String.format("%-12d%-12.5f%-12.5f%-12.5f%-12.5f%-12.5f",
			// hour, az, alt, x, y, z);
			t = String.format("%-12d%-12.5f%-12.5f%-12.5f%-12.0f%-12.0f%-12.0f", hour, az, zen, alt, x, y, z);
			System.out.println(t);

		}
	}

}
