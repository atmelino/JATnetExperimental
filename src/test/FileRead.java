package test;

import java.io.*;
import java.text.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class FileRead extends HttpServlet {

	private static final long serialVersionUID = -8463638777132942787L;

	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		res.setContentType("text/plain; charset=Shift_JIS");
		PrintWriter out = res.getWriter();
		res.setHeader("Content-Language", "ja");

		Locale locale = new Locale("ja", "");
		DateFormat full = DateFormat.getDateTimeInstance(DateFormat.LONG,
				DateFormat.LONG, locale);
		out.println("In Japanese:");

		try {
			FileInputStream fis = new FileInputStream(
					req.getRealPath("/HelloWorld.ISO-2022-JP"));
			InputStreamReader isr = new InputStreamReader(fis, "ISO-2022-JP");
			BufferedReader reader = new BufferedReader(isr);
			String line = null;
			while ((line = reader.readLine()) != null) {
				out.println(line);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

		out.println(full.format(new Date()));
	}
}