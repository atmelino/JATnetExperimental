package jat.core.coordinates;



public class HourAngle
{
	public int hours;
	public int minutes;
	public double seconds;

	public HourAngle( )
	{
	}

	/** 
	 * @param hours between 0 and 24
	 * @param minutes between 0 and 59
	 * @param seconds between 0 and 59.9999
	 */
	public HourAngle( int hours, int minutes, double seconds)
	{
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}
	
	
}
