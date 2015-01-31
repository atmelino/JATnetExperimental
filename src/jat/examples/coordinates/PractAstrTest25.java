package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest25 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 25 equatorial to horizon coordinates conversion");

		AstroCoordinate rf = new AstroCoordinate();

		Angle HA = new Angle( 5, 51, 44, Angle.HOURANGLE);
		Angle dec = new Angle( 23, 13, 10, Angle.ARCDEGREES);
		rf.equatorialCoord = new EquatorialCoord(HA, null, dec);
		rf.equatorialCoord.println();
		rf.equatorialToHorizonDS(52);
		rf.horizontalCoord.println();

		
		System.out.println("Azimuth and altitude for latitude 52 deg and longitude 0 and GST= 0h 24m 05s:");		
		Angle RA = new Angle( 18, 32, 21, Angle.HOURANGLE);
		rf.equatorialCoord = new EquatorialCoord(null, RA, dec);
		rf.equatorialCoord.println();
		rf.equatorialToHorizonDS(0.401389);
		rf.horizontalCoord.println();
		
		
		
	}
}
