package jat.core.coordinates;


public class TimeLocation {

	int year;
	int month;
	int day;
	int hour;
	int minute;
	int second;
	double latitude;
	double longitude;

	public TimeLocation(int year, int month, int day, int hour, int minute, int second, double latitude,
			double longitude) {
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.latitude = latitude;
		this.longitude = longitude;
	}

}
