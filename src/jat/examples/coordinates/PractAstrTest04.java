package jat.examples.coordinates;

import jat.core.coordinates.AstroDateTime;

public class PractAstrTest04 {

	public static void main(final String[] args) {
		String s, t;

		double JD_HST, JD_MST, JD_CST, JD_EST, JD_UTC;

		System.out.println("Practical Astronomy 04 Julian Day Numbers");

		JD_HST = (new AstroDateTime(1985, 2, 17, 6, 0, 0, "HST")).getJD();
		JD_MST = (new AstroDateTime(1985, 2, 17, 6, 0, 0, "MST")).getJD();
		JD_CST = (new AstroDateTime(1985, 2, 17, 6, 0, 0, "CST6CDT")).getJD();
		JD_EST = (new AstroDateTime(1985, 2, 17, 6, 0, 0, "EST")).getJD();
		JD_UTC = (new AstroDateTime(1985, 2, 17, 6, 0, 0, "UTC")).getJD();

		s = String.format("%-24s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-24s%-12.2f%-12.2f", "2/17/1985 06:00:00 HST", 2446114.17, JD_HST);
		System.out.println(t);
		t = String.format("%-24s%-12.2f%-12.2f", "2/17/1985 06:00:00 MST", 2446114.04, JD_MST);
		System.out.println(t);
		t = String.format("%-24s%-12.2f%-12.2f", "2/17/1985 06:00:00 CST", 2446114.00, JD_CST);
		System.out.println(t);
		t = String.format("%-24s%-12.2f%-12.2f", "2/17/1985 06:00:00 EST", 2446113.96, JD_EST);
		System.out.println(t);
		t = String.format("%-24s%-12.2f%-12.2f", "2/17/1985 06:00:00 UTC", 2446113.75, JD_UTC);
		System.out.println(t);

	}
}

