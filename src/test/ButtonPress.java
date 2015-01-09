package test;

 
import java.io.IOException;
import java.io.PrintWriter;
 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 

@WebServlet("/ButtonPress")    // defines a Servlet mapped to "/ButtonPress"
public class ButtonPress extends HttpServlet {
 
	private static final long serialVersionUID = -2141616691592817484L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
 
		// Set response header
		response.setContentType("text/html;UTF-8");
 
		// Set response body content. response body is returned as Ajax Response Text
		PrintWriter writer = response.getWriter();
		writer.write("Hello World!!");    // "Hello World!!" is returned as Ajax Response Text in this example
 
		writer.close();
	}
}