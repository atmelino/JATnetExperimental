package solarpositioning;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import solarpositioning.AzimuthZenithAngle;
import solarpositioning.SPA;

public class SPATest {

	public static void main(final String[] args) {

		//GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-7 * 60 * 60 * 1000, "LST"));
		//time.set(2003, Calendar.OCTOBER, 17, 12, 30, 30); // 17 October 2003,
															// 12:30:30
															// LST-07:00

		//AzimuthZenithAngle result = SPA.calculateSolarPosition(time, 39.742476, -105.1786, 1830.14, 67, 820, 11);

		
		GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-6 * 60 * 60 * 1000, "LST"));
		//time.set(2015, Calendar.JANUARY, 19, 22, 00, 00); 
		//time.set(2015, Calendar.APRIL, 19, 22, 00, 00); 
		time.set(2015, Calendar.DECEMBER, 19, 22, 00, 00); 

		//AzimuthZenithAngle result = SPA.calculateSolarPosition(time, 27.41305, -82.66034, 1830.14, 67, 820, 11);
		AzimuthZenithAngle result = SPA.calculateSolarPosition(time, 30.25, -97.75, 1830.14, 67, 820, 11);

		System.out.println(result.getAzimuth());
		System.out.println(90-result.getZenithAngle());
	}

}
