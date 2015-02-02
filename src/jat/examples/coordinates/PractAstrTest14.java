package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroDateTime;

public class PractAstrTest14 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 14 GST to LST");

		Angle longitude = new Angle(-64.,Angle.DEGREES);
		AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 52, "UTC",longitude);
		
		adt.println();
		s = String.format("%-24s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		//t = String.format("%-24s%-12.2f%-12.2f", "4/22/1980 14:36:52 UTC", 4.668, GST);
		//System.out.println(t);

	}
}
