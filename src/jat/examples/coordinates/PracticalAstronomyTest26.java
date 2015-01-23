package jat.examples.coordinates;

import org.apache.commons.math3.geometry.spherical.twod.S2Point;
import org.apache.commons.math3.util.FastMath;
import jat.core.coordinates.*;

public class PracticalAstronomyTest26 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy horizon to equtorial coordinates conversion");

		ReferenceFrame rf = new ReferenceFrame();
		double az = org.apache.commons.math3.util.FastMath.toRadians(283.271111);
		double alt = org.apache.commons.math3.util.FastMath.toRadians(19.334444);
		rf.horCoord = new S2Point(az, alt);

		rf.horizonToEquatorial();

	}
}
