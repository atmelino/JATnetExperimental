package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroDateTime;
import jat.core.coordinates.AstroUtil;

public class PractAstrTest24 {

	public static void main(final String[] args) {
		Angle RA,HA;
		String s, t;

		System.out.println("Practical Astronomy 24 RA to HA and HA to RA");
		System.out.println("RA=18h 32m 21s on 4/22/1980 14:36:51.67 UTC at longitude 64West, convert to Hour Angle");

		Angle longitude = new Angle(-64, Angle.DEGREES);
		AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 51, 670, "UTC", longitude);
		RA = new Angle(18, 32, 21, Angle.HOURANGLE);
		HA = AstroUtil.rightAscensionToHourAngle(adt, RA);

		//adt.getLST().println("LST", Angle.DECIMALHOURS);
		//RA.println("RA", Angle.DECIMALHOURS);
		//HA.println("HA", Angle.DECIMALHOURS);

		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "HA", "5.862286", HA.getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "HA", "5h 51m 44s", HA.getHAString());
		System.out.println(t);
		System.out.println();

		//adt.getLST().println("LST", Angle.DECIMALHOURS);
		System.out.println("HA=5h 51m 244s on 4/22/1980 14:36:51.67 UTC at longitude 64West, convert to Right Ascension");
		HA = new Angle(5, 51, 44, Angle.HOURANGLE);
		//HA.println("HA", Angle.DECIMALHOURS);
		RA=AstroUtil.hourAngleToRightAscension(adt, HA);

		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "RA", "18.539230", RA.getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "RA", "18h 32m 21s", RA.getHAString());
		System.out.println(t);
		
		
	}
}
