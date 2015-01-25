package jat.core.coordinates;

public class EclipticCoord {
	public Angle lambda; // ecliptic longitude
	public Angle beta; // ecliptic latitude beta

	
	public EclipticCoord() {
	}

	public EclipticCoord(Angle lambda, Angle beta) {
		this.lambda = lambda;
		this.beta = beta;
	}
}
