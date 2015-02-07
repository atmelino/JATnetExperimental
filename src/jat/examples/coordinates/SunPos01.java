package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroCoordinate;
import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.solarPositioning.SPA;

public class SunPos01 {
	public static void main(String[] args) {

		AstroDateTimeLocation adt = new AstroDateTimeLocation(2003, 3, 1, 0, 0, 0, "UTC");
		AstroCoordinate ac = SPA.getSolarPosition(adt, 30.00, -97.00, 1830.14, 67., 820., 11.);
		System.out.println(adt.getLocalDateTime());
		System.out.println("JD="+adt.getJD());

		ac.eclipticCoord.lambda.println("ecliptic longitude", Angle.ARCDEGREES);
		ac.eclipticCoord.beta.println("ecliptic latitude", Angle.DEGREES);
		ac.equatorialCoord.println();
		//ac.equatorialCoord.println();
		ac.horizontalCoord.println();
	}

}
