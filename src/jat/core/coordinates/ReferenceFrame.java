package jat.core.coordinates;

import org.apache.commons.math3.geometry.spherical.twod.S2Point;
import org.joda.time.DateTime;
import org.joda.time.Days;

public class ReferenceFrame {

	public double lat;

	DateTime currentDateTime;

	// azimuth angle θ in the x-y plane as the first coordinate, and the polar
	// angle φ as the second coordinate
	public S2Point horizontalCoord = new S2Point(0, 0);

	// right ascension, declination
	public S2Point equatorialCoord = new S2Point(0, 0);

	// ecliptic longitude lambda, ecliptic latitude beta
	// public S2Point eclipticCoord = new S2Point(0, 0);
	public EclipticCoord eclipticCoord = new EclipticCoord(new Angle(true, 139, 41, 10, Angle.ARCDEGREES), new Angle(true, 4, 52, 31, Angle.ARCDEGREES));

	public void eclipticToEquatorial() {
		System.out.println("eclipticToEquatorial");

		Angle lambda = eclipticCoord.lambda;
		Angle beta = eclipticCoord.beta;

		lambda.println();
		beta.println();
	}

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

		currentDateTime = dt;

		Days days = Days.daysBetween(epoch, dt);

		System.out.println("Days Since Epoch: " + days.getDays());

		double N0 = 360 / 365.242191 * days.getDays();
		// System.out.println("N: " + N0);

		double N1 = N0 % 360;
		double N;

		if (N1 < 0)
			N = N1 + 360;
		else
			N = N1;
		// for (int i = 0; i < 11; i++)
		// System.out.println("N in range: " + (N + i * 360));
		System.out.println("N: " + N % 360);

		// mean anomaly
		double M0 = N + Constants.eps_g_1990 - Constants.omega_g_1990;
		double M;
		if (M0 < 0)
			M = M0 + 360;
		else
			M = M0;
		System.out.println("M: " + M);
		double MRad = org.apache.commons.math3.util.FastMath.toRadians(M);

		// true anomaly
		double E_c = (360 / Math.PI) * Constants.e_earth * Math.sin(MRad);
		System.out.println("E_c: " + E_c);

		// Sun's geocentric ecliptic longitude
		double lambda0 = N + E_c + Constants.eps_g_1990;
		// System.out.println("lambda: " + lambda0);

		double lambda = lambda0 % 360;
		System.out.println("lambda: " + lambda);

		// eclipticCoord = new S2Point(lambda, 0);
		eclipticCoord = new EclipticCoord(new Angle(lambda, Angle.DEGREES), new Angle(0, Angle.DEGREES));

	}

}
