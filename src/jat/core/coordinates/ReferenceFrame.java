package jat.core.coordinates;

import org.apache.commons.math3.geometry.spherical.twod.S2Point;

public class ReferenceFrame {

	public double lat;
	// azimuth angle θ in the x-y plane as the first coordinate, and the polar
	// angle φ as the second coordinate
	public S2Point horCoord = new S2Point(0, 0);

	public void horizonToEquatorial() {
		System.out.println("horizonToEquatorial");

		String s = String.format("%-12s%-12s", "az(rad)", "alt(rad)");
		System.out.println(s);
		String t = String.format("%-12.5f%-12.5f", horCoord.getTheta(), horCoord.getPhi());
		System.out.println(t);
		s = String.format("%-12s%-12s", "az(deg)", "alt(deg)");
		System.out.println(s);
		t = String.format("%-12.5f%-12.5f", org.apache.commons.math3.util.FastMath.toDegrees(horCoord.getTheta()), org.apache.commons.math3.util.FastMath.toDegrees(horCoord.getPhi()));
		System.out.println(t);

	}

}
