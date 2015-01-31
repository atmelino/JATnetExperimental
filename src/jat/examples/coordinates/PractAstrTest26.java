package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest26 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 26 horizon to equatorial coordinates conversion");

		AstroCoordinate rf = new AstroCoordinate();
		Angle Az = new Angle(283.271111, Angle.DEGREES);
		Angle Alt = new Angle(19.334444, Angle.DEGREES);
		rf.horizontalCoord = new HorizontalCoord(Az, Alt);
		rf.horizontalCoord.println();
		
		System.out.println("hour angle and dec for latitude 52 deg:");
		rf.horizonToEquatorial(52);		
		rf.equatorialCoord.println();
		
		System.out.println("RA and dec for latitude 52 deg and longitude 0 and GST= 0h 24m 05s:");		
		rf.horizonToEquatorial(0.401389);
		rf.equatorialCoord.println();
		rf.equatorialCoord.RA.println("RA decimal hours", Angle.DECIMALHOURS);
	}
}
