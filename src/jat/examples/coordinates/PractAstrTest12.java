package jat.examples.coordinates;

import jat.core.coordinates.AstroDateTime;

public class PractAstrTest12 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 12 UT to GST");
		System.out.println("4/22/1980 14:36:52 UTC");

		AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 51, 670,"UTC");
		//AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 52,"UTC");
		//adt.println();
		double GST = adt.getGST().getHours();
		String GSTString = adt.getGST().getHAString();
		s = String.format("%-14s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-14s%-12.6f%-12.6f", "GST", 4.668119, GST);
		System.out.println(t);
		t = String.format("%-14s%-12s%-12s", "GST", "04:40:05", GSTString);
		System.out.println(t);

	}
}
