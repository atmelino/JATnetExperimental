package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroDateTime;

public class PractAstrTest14 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 14 GST to LST");
		System.out.println("LST for 64West when GST is 4h40m5.23s");

		Angle longitudeGreenwich = new Angle(0., Angle.DEGREES);
		AstroDateTime adtGreenwich = new AstroDateTime(1980, 4, 22, 14, 36, 51, 670, "UTC", longitudeGreenwich);
		Angle longitude64 = new Angle(-64., Angle.DEGREES);
		AstroDateTime adt64 = new AstroDateTime(1980, 4, 22, 14, 36, 51, 670, "UTC", longitude64);

		
		s = String.format("%-24s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-24s%-12.6f%-12.6f", "GST", 4.668119, adtGreenwich.getGST().getHours());
		System.out.println(t);
		t = String.format("%-24s%-12.6f%-12.6f", "LST in Greenwich", 4.668119, adtGreenwich.getLST().getHours());
		System.out.println(t);
		t = String.format("%-24s%-12.6f%-12.6f", "LST at 64 West", 0.401453, adt64.getLST().getHours());
		System.out.println(t);
		t = String.format("%-24s%-12s%-12s", "LST at 64 West", "0:24:05", adt64.getLST().getHAString());
		System.out.println(t);

	}
}
