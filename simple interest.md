import java.util.Scanner;

public class SimpleInterestCalculator {
    public static void main(String[] args) {
        // Create a Scanner object for user input
        Scanner scanner = new Scanner(System.in);
        
        // Input principal amount
        System.out.print("Enter the principal amount: ");
        double principal = scanner.nextDouble();
        
        // Input rate of interest
        System.out.print("Enter the rate of interest (in %): ");
        double rate = scanner.nextDouble();
        
        // Input time period in years
        System.out.print("Enter the time period (in years): ");
        double time = scanner.nextDouble();
        
        // Calculate simple interest
        double simpleInterest = (principal * rate * time) / 100;
        
        // Output the result
        System.out.printf("The simple interest is: %.2f%n", simpleInterest);
        
        // Close the scanner
        scanner.close();
    }
}
