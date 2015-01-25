package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PracticalAstronomyTest27 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy ecliptic to equatorial coordinates conversion");

		ReferenceFrame rf = new ReferenceFrame();
		rf.eclipticToEquatorial();

	}
}
