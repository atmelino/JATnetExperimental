package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest25 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 25 equatorial to horizon coordinates conversion");

		ReferenceFrame rf = new ReferenceFrame();
				
		Angle HA = new Angle(true,5,51,44, Angle.HOURANGLE);
		Angle dec = new Angle(true,23,13,10, Angle.ARCDEGREES);
		rf.equatorialCoord = new EquatorialCoord(HA, null, dec);
		rf.equatorialCoord.println();
		rf.latDeg = 52;
		
		
		rf.equatorialToHorizon();
		
	}
}
