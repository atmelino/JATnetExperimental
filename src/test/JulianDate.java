package test;

import java.io.IOException;
import java.io.PrintWriter;
 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jat.coreNOSA.cm.cm;

@WebServlet("/test/JulianDate") 
public class JulianDate extends HttpServlet {
 	
	private static final long serialVersionUID = 2282312526102500868L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
 
		// Set response header
		response.setContentType("text/html;UTF-8");
 
		// Set response body content. response body is returned as Ajax Response Text
		PrintWriter writer = response.getWriter();

		
		String message1="The Julian date on 1-1-2001 at 12:00pm is ";
		String message2=""+cm.juliandate(2001, 1, 1, 12, 0, 0);

		
		//writer.write("Hello World!!");    // "Hello World!!" is returned as Ajax Response Text in this example
		writer.write(message2);    // "Hello World!!" is returned as Ajax Response Text in this example
 
		writer.close();
	}
}