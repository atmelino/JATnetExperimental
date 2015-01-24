package jat.core.coordinates;

import org.apache.commons.math3.geometry.spherical.twod.S2Point;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.Months;
import org.joda.time.MutableDateTime;
import org.joda.time.Weeks;

public class ReferenceFrame {

	public double lat;

	// azimuth angle θ in the x-y plane as the first coordinate, and the polar
	// angle φ as the second coordinate
	public S2Point horizontalCoord = new S2Point(0, 0);

	// right ascension, declination
	public S2Point equatorialCoord = new S2Point(0, 0);

	public void horizonToEquatorial() {
		System.out.println("horizonToEquatorial");

		double az = horizontalCoord.getTheta();
		double alt = horizontalCoord.getPhi();
		String s = String.format("%-12s%-12s%-12s", "az(rad)", "alt(rad)", "lat(rad)");
		System.out.println(s);
		String t = String.format("%-12.5f%-12.5f%-12.5f", az, alt, lat);
		System.out.println(t);
		s = String.format("%-12s%-12s%-12s", "az(deg)", "alt(deg)", "lat(deg)");
		System.out.println(s);
		double azDeg = org.apache.commons.math3.util.FastMath.toDegrees(horizontalCoord.getTheta());
		double altDeg = org.apache.commons.math3.util.FastMath.toDegrees(horizontalCoord.getPhi());
		double latDeg = org.apache.commons.math3.util.FastMath.toDegrees(lat);
		t = String.format("%-12.5f%-12.5f%-12.5f", azDeg, altDeg, latDeg);
		System.out.println(t);
		double dec = Math.asin(Math.sin(alt) * Math.sin(lat) + Math.cos(alt) * Math.cos(lat) * Math.cos(az));
		double HA = Math.acos((Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec)));
		double decDeg = org.apache.commons.math3.util.FastMath.toDegrees(dec);
		double HADeg = org.apache.commons.math3.util.FastMath.toDegrees(HA);
		s = String.format("%-12s%-12s", "dec(deg)", "HA(deg)");
		System.out.println(s);
		t = String.format("%-12.5f%-12.5f", decDeg, HADeg);
		System.out.println(t);

	}

	public void sunPosition(DateTime epoch, DateTime dt) {
		System.out.println("sunPosition");

		// MutableDateTime epoch = new MutableDateTime();
		// epoch.setDate(0); //Set to Epoch time
		// DateTime now = new DateTime();
		//
		// Days days = Days.daysBetween(epoch, now);
		// Weeks weeks = Weeks.weeksBetween(epoch, now);
		// Months months = Months.monthsBetween(epoch, now);
		//
		// System.out.println("Days Since Epoch: " + days.getDays());
		// System.out.println("Weeks Since Epoch: " + weeks.getWeeks());
		// System.out.println("Months Since Epoch: " + months.getMonths());

		Days days = Days.daysBetween(epoch, dt);
		Weeks weeks = Weeks.weeksBetween(epoch, dt);
		Months months = Months.monthsBetween(epoch, dt);

		System.out.println("Days Since Epoch: " + days.getDays());
		System.out.println("Weeks Since Epoch: " + weeks.getWeeks());
		System.out.println("Months Since Epoch: " + months.getMonths());
		int daysInt = Math.abs(days.getDays());
		System.out.println("daysInt: " + daysInt);

		double N = 360 / 365.242191 * days.getDays();
		System.out.println("N: " + N);

		for (int i = 0; i < 11; i++)
			System.out.println("N in range: " + (N + i * 360));

	}

}
