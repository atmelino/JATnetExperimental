package jat.examples.coordinates;

import jat.core.coordinates.AstroCoordinate;
import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.solarPositioning.SPA;

public class SunPos01 {
	public static void main(String[] args) {

		AstroDateTimeLocation adt = new AstroDateTimeLocation(2015, 2, 2, 13, 0, 0, "CST6CDT");
		AstroCoordinate ac = SPA.getSolarPosition(adt, 30.00, -97.00, 1830.14, 67., 820., 11.);
		ac.equatorialCoord.println();
		ac.horizontalCoord.println();
	}

}
