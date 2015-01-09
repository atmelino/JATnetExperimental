package test;


import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jat.core.ephemeris.DE405Body.body;
import jat.core.ephemeris.DE405Frame.frame;
import jat.core.ephemeris.DE405Plus;
import jat.coreNOSA.math.MatrixVector.data.VectorN;
import jat.coreNOSA.spacetime.Time;



public class Ephemeris1 extends HttpServlet {
	private static final long serialVersionUID = 4943165717907774780L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html");
		// String filename = "/var/lib/tomcat7/webapps/JATServlet/test.txt";
		// String filename = "/var/lib/tomcat7/webapps/data/test.txt";
		String filename = "/var/lib/tomcat7/webapps/data/ascp2000.405";

		PrintWriter pw = response.getWriter();
		pw.println("Absolute path demo <br>");
		pw.println("path:" + filename + "<br>");

		Time mytime = new Time(2002, 2, 17, 12, 0, 0);
		DE405Plus ephem = new DE405Plus("/var/lib/tomcat7/webapps/data/");
		VectorN rv;
		try {
			ephem.setFrame(frame.ICRF);
			System.out.println("ICRF Frame");
			pw.println("ICRF Frame");

			rv = ephem.get_planet_posvel(body.MARS, mytime);
			System.out
					.println("The position of Mars on 10-17-2002 at 12:00pm was ");
			System.out.println("x= " + rv.get(0) + " km");
			pw.println("x= " + rv.get(0) + " km");
			System.out.println("y= " + rv.get(1) + " km");
			System.out.println("z= " + rv.get(2) + " km");
			System.out
					.println("The velocity of Mars on 10-17-2002 at 12:00pm was ");
			System.out.println("vx= " + rv.get(3) + " km/s");
			System.out.println("vy= " + rv.get(4) + " km/s");
			System.out.println("vz= " + rv.get(5) + " km/s");

		} catch (IOException e) {
			pw.println("exception: " + e);
			e.printStackTrace();
		}

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}
}
