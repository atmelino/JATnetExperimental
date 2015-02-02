package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest25 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 25 equatorial to horizon coordinates conversion");

		AstroCoordinate ac = new AstroCoordinate();

		Angle HA = new Angle(5, 51, 44, Angle.HOURANGLE);
		Angle dec = new Angle(23, 13, 10, Angle.ARCDEGREES);
		ac.equatorialCoord = new EquatorialCoord(HA, null, dec);
		ac.equatorialCoord.HA.println("HA", Angle.HOURANGLE);
		ac.equatorialCoord.HA.println("HA decimal", Angle.DECIMALHOURS);
		ac.equatorialCoord.dec.println("dec", Angle.DEGREES);
		// ac.equatorialCoord.println();
		ac.equatorialToHorizonDS(52);
		// ac.horizontalCoord.println();
		ac.horizontalCoord.altitude.println("alt", Angle.DEGREES);
		ac.horizontalCoord.azimuth.println("Az", Angle.DEGREES);
		ac.horizontalCoord.altitude.println("alt", Angle.ARCDEGREES);
		ac.horizontalCoord.azimuth.println("Az", Angle.ARCDEGREES);

		System.out.println();
		System.out.println("Azimuth and altitude for latitude 52 deg and longitude 64 West:");
		
		Angle longitude = new Angle(-64, Angle.DEGREES);
		Angle RA = new Angle(18, 32, 21, Angle.HOURANGLE);
		AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 52, "UTC", longitude);
		//HA=AstroUtil.rightAscensionToHourAngle(adt, RA);		
		ac.equatorialCoord = new EquatorialCoord(null, RA, dec);
		ac.equatorialCoord.println();
		ac.equatorialToHorizonDS(adt,52);
		ac.horizontalCoord.println();

	}
}
