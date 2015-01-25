package jat.core.coordinates;



public class HourAngle
{
	public boolean positive;
	public int hours;
	public int minutes;
	public double seconds;

	public HourAngle()
	{
	}

	public HourAngle(boolean positive, int hours, int minutes, double seconds)
	{
		this.positive = positive;
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}
}
