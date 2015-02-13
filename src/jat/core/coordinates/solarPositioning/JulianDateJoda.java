package jat.core.coordinates.solarPositioning;

import jat.core.coordinates.AstroDateTimeLocation;


/**
 * Calculate Julian date for a given point in time. This follows the algorithm
 * described in Reda, I.; Andreas, A. (2003): Solar Position Algorithm for Solar
 * Radiation Applications. NREL Report No. TP-560-34302, Revised January 2008.
 * 
 * @author Klaus Brunner
 * 
 */
public final class JulianDateJoda {
	//private AstroDateTimeLocation adt;
	private final double julianDate;
	private final double deltaT;

	/**
	 * Construct a Julian date, assuming deltaT to be 0.
	 * 
	 * @param date
	 */
	public JulianDateJoda(final AstroDateTimeLocation adt) {
		//this.adt = adt;
		this.julianDate = adt.getJD();
		this.deltaT = 0.0;
	}

	/**
	 * Construct a Julian date, observing deltaT.
	 * 
	 * @param date
	 * @param deltaT
	 *            Difference between earth rotation time and terrestrial time
	 *            (or Universal Time and Terrestrial Time), in seconds. See <a
	 *            href
	 *            ="http://maia.usno.navy.mil/ser7/deltat.preds">http://maia.
	 *            usno.navy.mil/ser7/deltat.preds</a> for values. For the year
	 *            2013, a reasonably accurate default would be 67.
	 */
	public JulianDateJoda(final AstroDateTimeLocation adt, final double deltaT) {
		//this.adt = adt;
		this.julianDate = adt.getJD();
		this.deltaT = deltaT;
	}

	public double getJulianDate() {
		return julianDate;
	}

	public double getJulianEphemerisDay() {
		return julianDate + deltaT / 86400.0;
	}

	public double getJulianCentury() {
		return (julianDate - 2451545.0) / 36525.0;
	}

	public double getJulianEphemerisCentury() {
		return (getJulianEphemerisDay() - 2451545.0) / 36525.0;
	}

	public double getJulianEphemerisMillennium() {
		return getJulianEphemerisCentury() / 10.0;
	}

	@Override
	public String toString() {
		return String.format("%.5f", julianDate);
	}

}
