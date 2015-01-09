package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FileRead2 extends HttpServlet {
	private static final long serialVersionUID = 4943165717907774780L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html");
		String filename = "/test.txt";
		ServletContext context = getServletContext();

		PrintWriter pw = response.getWriter();
		InputStream inp = context.getResourceAsStream(filename);
		if (inp != null) {
			InputStreamReader isr = new InputStreamReader(inp);
			BufferedReader reader = new BufferedReader(isr);
			pw.println("<html><head><title>Read Text File</title></head><body bgcolor='cyan'></body></html>");
			String text = "";
			while ((text = reader.readLine()) != null) {
				pw.println("<h2><i><b>" + text + "</b></i></b><br>");
			}
		}
		else
			pw.println("input "+filename+" not opened" );
			
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}
}
