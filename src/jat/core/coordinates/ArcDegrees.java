package jat.core.coordinates;



public class ArcDegrees
{
	boolean positive;
	int degrees, minutes;
	double seconds;

	public ArcDegrees()
	{
	}

	public ArcDegrees(boolean positive, int degrees, int minutes, double seconds)
	{
		this.positive = positive;
		this.degrees = degrees;
		this.minutes = minutes;
		this.seconds = seconds;
	}
}
