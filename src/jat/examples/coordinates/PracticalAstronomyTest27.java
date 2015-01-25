package jat.examples.coordinates;

import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.chrono.GJChronology;
import org.joda.time.chrono.GregorianChronology;
import org.joda.time.chrono.ISOChronology;
import org.joda.time.chrono.JulianChronology;

import jat.core.coordinates.*;

public class PracticalAstronomyTest27 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy ecliptic to equatorial coordinates conversion");
		//Chronology chrono = JulianChronology.getInstance();
		//Chronology chrono = GJChronology.getInstance();
		//Chronology chrono = ISOChronology.getInstance();
		Chronology chrono = GregorianChronology.getInstance();
		DateTime currentDateTime = new DateTime(1979, 12, 30,18, 0, chrono);
		
		ReferenceFrame rf = new ReferenceFrame();
		rf.eclipticToEquatorial(currentDateTime);

	}
}
