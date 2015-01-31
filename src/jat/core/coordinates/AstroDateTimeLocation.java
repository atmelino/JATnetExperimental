package jat.core.coordinates;


/**
 * Observer local time, date, and location
 * @author Tobias Berthold
 *
 */
public class AstroDateTimeLocation {


	AstroDateTime ADT;
	double latitude;
	double longitude;
	
	public AstroDateTimeLocation(AstroDateTime aDT, double latitude, double longitude) {
		super();
		ADT = aDT;
		this.latitude = latitude;
		this.longitude = longitude;
	}



}
