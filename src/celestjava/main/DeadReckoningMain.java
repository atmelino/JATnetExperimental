package celestjava.main;

import celestjava.astro.calc.DeadReckoning;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import celestjava.user.util.GeomUtil;

/**
 * A System Concole interface for Celestial navigation.
 * Prompts the user for parameters.
 *
 * @author olivier@lediouris.net
 */
public class DeadReckoningMain
{
  private static BufferedReader stdin = new BufferedReader(new InputStreamReader(System.in));
  /**
   * main
   * @param args Useless
   */
  public static void main(String[] args)
  {
    String d   = userInput("GHA > Deg :                 ");
    String m   = userInput("GHA > Min :                 ");
    double AHG = GeomUtil.SexToDec(d, m);

    d          = userInput("Declination > Deg :         ");
    m          = userInput("Declination > Min :         ");
    double D = GeomUtil.SexToDec(d, m);
    String ns  = userInput("North[N] or South[S] >      ");
    if (ns.toUpperCase().equals("S"))
      D *= -1;

    d          = userInput("Estimated Latitude > Deg :  ");
    m          = userInput("Estimated Latitude > Min :  ");
    double L = GeomUtil.SexToDec(d, m);
    ns         = userInput("North[N] or South[S] >      ");
    if (ns.toUpperCase().equals("S"))
      L *= -1;

    d          = userInput("Estimated Longitude > Deg : ");
    m          = userInput("EstimatedLongitude  > Min : ");
    double G = GeomUtil.SexToDec(d, m);
    ns         = userInput("Est[E] or West[W] >         ");
    if (ns.toUpperCase().equals("W"))
      G *= -1;

//  System.out.println("AHG : " + Double.toString(AHG));
//  System.out.println("D   : " + Double.toString(D));
//  System.out.println("L   : " + Double.toString(L));
//  System.out.println("G   : " + Double.toString(G));

    DeadReckoning estime = new DeadReckoning(AHG, D, L, G);
    estime.calculate();
    System.out.println("Est. Alt. : " + GeomUtil.DecToSex(estime.getHe().doubleValue()));
    System.out.println("aZimuth   : " + GeomUtil.DecToSex(estime.getZ().doubleValue()));

    double calculatedAltitude = estime.getHe().doubleValue();
    double eye = 1.8;
    System.out.println("Correcting Altitude, for eye height = " + eye + " meters above sea level");
    double correctedAltitude = estime.correctedAltitude(calculatedAltitude,
                                                        eye,
                                                        0.1,
                                                        16.2,
                                                        DeadReckoning.LOWER_LIMB);
    System.out.println("Corr. Alt. : " + GeomUtil.DecToSex(correctedAltitude));
    
    userInput("Done.");
  }
  /**
   * Reads the standard input
   *
   * @param prompt The String that prompts the user
   */
  private static String userInput(String prompt)
  {
    String retString = "";
    System.out.print(prompt);
    try { retString = stdin.readLine(); }
    catch (Exception e)
    {
      System.err.println(e.toString());
    }
    return retString;
  }
}

