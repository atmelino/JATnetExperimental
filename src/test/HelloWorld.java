package test;





import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

// Extend HttpServlet class
public class HelloWorld extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private String message;

	public void init() throws ServletException {
		// Do required initialization
		message = "Hello World";
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// Set response content type
		response.setContentType("text/html");

		// Actual logic goes here.

		// getting current date and time using Date class
		DateFormat df = new SimpleDateFormat("dd/MM/yy HH:mm:ss");
		Date dateobj = new Date();
		//System.out.println(df.format(dateobj));

		/*
		 * getting current date time using calendar class An Alternative of
		 * above
		 */
		Calendar calobj = Calendar.getInstance();
		//System.out.println(df.format(calobj.getTime()));

		message=df.format(dateobj);
		PrintWriter out = response.getWriter();

		out.println("<h1>" + message + "</h1>");
	}

	public void destroy() {
		// do nothing.
	}
}