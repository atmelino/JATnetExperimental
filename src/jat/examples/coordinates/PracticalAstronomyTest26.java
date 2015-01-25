package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PracticalAstronomyTest26 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy horizon to equatorial coordinates conversion");

		ReferenceFrame rf = new ReferenceFrame();
		rf.horizontalCoord =  new HorizontalCoord(new Angle(283.271111, Angle.DEGREES), new Angle(19.334444, Angle.DEGREES));		
		rf.latDeg=52;
		rf.horizonToEquatorial();

	}
}
