package jat.tests.core.coordinates;

import jat.core.coordinates.AstroDateTimeLocation;

public class AstroDateTimeTest02 {

	public static void main(final String[] args) {

		System.out.println("AstroDateTimeTest02");
		System.out.println("Make sure that exceptions are thrown if user does not provide longitude but wants local sidereal time");

		AstroDateTimeLocation adt = new AstroDateTimeLocation(1980, 4, 22, 14, 36, 52, "UTC");
		System.out.println(adt.getLST());

		
	}

}
