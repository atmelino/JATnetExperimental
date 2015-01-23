package jat.core.coordinates;

import org.apache.commons.math3.geometry.spherical.twod.S2Point;

public class ReferenceFrame {

	public double lat;
	// azimuth angle θ in the x-y plane as the first coordinate, and the polar
	// angle φ as the second coordinate
	public S2Point horCoord = new S2Point(0, 0);

	public void horizonToEquatorial() {
		System.out.println("horizonToEquatorial");

		double az=horCoord.getTheta();
		double alt=horCoord.getPhi();
		String s = String.format("%-12s%-12s%-12s", "az(rad)", "alt(rad)", "lat(rad)");
		System.out.println(s);
		String t = String.format("%-12.5f%-12.5f%-12.5f", az, alt,lat);
		System.out.println(t);
		s = String.format("%-12s%-12s%-12s", "az(deg)", "alt(deg)", "lat(deg)");
		System.out.println(s);
		double azDeg=org.apache.commons.math3.util.FastMath.toDegrees(horCoord.getTheta());
		double altDeg=org.apache.commons.math3.util.FastMath.toDegrees(horCoord.getPhi());
		double latDeg=org.apache.commons.math3.util.FastMath.toDegrees(lat);
		t = String.format("%-12.5f%-12.5f%-12.5f", azDeg, altDeg,latDeg);
		System.out.println(t);
		double dec = Math.asin(Math.sin(alt) * Math.sin(lat) + Math.cos(alt) * Math.cos(lat) * Math.cos(az));
		double HA = Math.acos((Math.sin(alt) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec)));
		double decDeg=org.apache.commons.math3.util.FastMath.toDegrees(dec);
		double HADeg=org.apache.commons.math3.util.FastMath.toDegrees(HA);
		s = String.format("%-12s%-12s", "dec(deg)", "HA(deg)");
		System.out.println(s);
		t = String.format("%-12.5f%-12.5f", decDeg, HADeg);
		System.out.println(t);

		
	}

}
