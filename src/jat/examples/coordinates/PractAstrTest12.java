package jat.examples.coordinates;

import jat.core.coordinates.AstroDateTime;

public class PractAstrTest12 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 12 UT to GST");

		AstroDateTime adt= new AstroDateTime(1980, 4, 22, 14, 36, 52, "UTC");

		double GST=adt.getGST().getHours();
		String GSTString=adt.getGST().getHAString();
		s = String.format("%-24s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-24s%-12.2f%-12.2f", "4/22/1980 14:36:52 UTC", 4.668, GST);
		System.out.println(t);
		t = String.format("%-24s%-12s%-12s", "4/22/1980 14:36:52 UTC", "04:40:05", GSTString);
		System.out.println(t);

	}
}

