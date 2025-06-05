import cmath # For complex mathematical operations, especially gamma
import numpy as np # For numerical operations and creating arrays for plotting
import matplotlib.pyplot as plt # For plotting

# Import the complex Gamma function from SciPy
try:
    from scipy.special import gamma as complex_gamma
except ImportError:
    print("SciPy library not found. Please install it using 'pip install scipy'")
    print("Cannot proceed without complex gamma function support.")
    exit() # Exit if scipy is not available

def regge_trajectory(x, alpha_0, alpha_prime):
    """
    Defines a linear Regge trajectory.
    alpha(x) = alpha_0 + alpha_prime * x

    Args:
        x (complex or float): Mandelstam variable (s, t, or u).
        alpha_0 (float): Regge intercept.
        alpha_prime (float): Regge slope (GeV^-2).

    Returns:
        complex or float: Value of the Regge trajectory at x.
    """
    return alpha_0 + alpha_prime * x

def veneziano_amplitude(s, t, alpha_0, alpha_prime):
    """
    Calculates the 4-point Veneziano scattering amplitude A(s,t).

    A(s,t) = Gamma(1 - alpha(s)) * Gamma(1 - alpha(t)) / Gamma(1 - alpha(s) - alpha(t))

    Args:
        s (complex or float): Mandelstam s-variable (squared center-of-mass energy).
        t (complex or float): Mandelstam t-variable (squared momentum transfer).
        alpha_0 (float): Regge intercept.
        alpha_prime (float): Regge slope.

    Returns:
        complex: The Veneziano amplitude. Returns cmath.inf for poles.
                 Returns cmath.nan for cases where Gamma function returns NaN.
    """
    alpha_s = regge_trajectory(s, alpha_0, alpha_prime)
    alpha_t = regge_trajectory(t, alpha_0, alpha_prime)

    # Arguments for the Gamma functions
    arg_s = 1 - alpha_s
    arg_t = 1 - alpha_t
    arg_denom = 1 - alpha_s - alpha_t

    try:
        # Calculate Gamma functions. scipy.special.gamma handles complex numbers.
        gamma_s = complex_gamma(arg_s)
        gamma_t = complex_gamma(arg_t)
        gamma_denom = complex_gamma(arg_denom)

        # Handle potential poles (Gamma -> infinity) and division by zero
        if cmath.isinf(gamma_s) or cmath.isinf(gamma_t):
            return cmath.inf # Pole in numerator, amplitude is infinite
        elif cmath.isinf(gamma_denom):
            # If denominator is infinite, the amplitude is effectively zero (pole of pole)
            # This happens if the argument of Gamma_denom is a non-positive integer
            # and the numerator arguments are not.
            # A more precise way to think about it is that if arg_denom is a pole,
            # it means there's a resonance in the u-channel.
            # However, numerically, dividing by infinity correctly gives zero.
            return 0.0 # Or you might want to consider this a numerical edge case.
        elif gamma_denom == 0:
            # This case shouldn't typically happen for standard arguments of Gamma,
            # as Gamma only goes to infinity at poles, not zero.
            # But as a safeguard for numerical stability, if it ever happens.
            return cmath.inf # Division by zero means a pole in the amplitude.
        else:
            return (gamma_s * gamma_t) / gamma_denom
    except Exception as e:
        # Catch any other numerical errors, e.g., if Gamma returns NaN
        print(f"Numerical error during amplitude calculation: {e}")
        return cmath.nan # Not a Number for undefined cases

# --- Example Usage and Visualization ---
if __name__ == "__main__":
    # Define physical parameters for the Rho meson trajectory (typical values)
    alpha_0 = 0.5  # Intercept
    alpha_prime = 0.9  # Slope (GeV^-2)

    print(f"Regge trajectory parameters: alpha_0 = {alpha_0}, alpha_prime = {alpha_prime}")

    # --- 1. Illustrate a single point calculation ---
    s_test = 1.0 + 0.01j # Example complex s (e.g., near a resonance)
    t_test = -0.2        # Example real t (momentum transfer typically negative in scattering)

    amp_val = veneziano_amplitude(s_test, t_test, alpha_0, alpha_prime)
    print(f"\nAmplitude for s = {s_test:.2f} GeV^2, t = {t_test:.2f} GeV^2:")
    print(f"A(s,t) = {amp_val}")
    print(f"Real part: {amp_val.real:.4f}, Imaginary part: {amp_val.imag:.4f}")

    # --- 2. Plotting the Amplitude as a function of s (fixed t) ---
    # This shows the resonance poles
    fixed_t = -0.2 # Fixed momentum transfer
    s_values = np.linspace(-1.0, 3.0, 500) # Range of s values
    # Add a small imaginary part to s to avoid hitting poles exactly on the real axis,
    # which can cause numerical issues with plotting tools showing true infinity.
    # This is common practice when visualizing functions with poles.
    epsilon = 0.01 # Small imaginary part
    s_complex_values = s_values + epsilon * 1j

    amplitude_magnitudes = []
    amplitude_phases = [] # Phase can also be interesting
    amplitude_real_parts = []
    amplitude_imag_parts = []

    for s_val in s_complex_values:
        amp = veneziano_amplitude(s_val, fixed_t, alpha_0, alpha_prime)
        amplitude_magnitudes.append(abs(amp))
        amplitude_phases.append(cmath.phase(amp))
        amplitude_real_parts.append(amp.real)
        amplitude_imag_parts.append(amp.imag)

    plt.figure(figsize=(12, 8))

    plt.subplot(2, 1, 1)
    plt.plot(s_values, amplitude_real_parts, label='Real Part')
    plt.plot(s_values, amplitude_imag_parts, label='Imaginary Part', linestyle='--')
    plt.title(f'Veneziano Amplitude (Real and Imaginary Parts) vs. s (fixed t={fixed_t} GeV$^2$)')
    plt.xlabel('s (GeV$^2$)')
    plt.ylabel('Amplitude Value')
    plt.ylim(-10, 10) # Set reasonable y-limits to see poles (or their vicinity)
    plt.grid(True)
    plt.axvline(x=1/alpha_prime - alpha_0/alpha_prime, color='r', linestyle=':', label='Pole at α(s)=1')
    plt.axvline(x=2/alpha_prime - alpha_0/alpha_prime, color='g', linestyle=':', label='Pole at α(s)=2')
    plt.legend()

    plt.subplot(2, 1, 2)
    plt.plot(s_values, np.log(amplitude_magnitudes), label='log(|A(s,t)|)') # Log scale to better see behavior
    plt.title(f'Log of Veneziano Amplitude Magnitude vs. s (fixed t={fixed_t} GeV$^2$)')
    plt.xlabel('s (GeV$^2$)')
    plt.ylabel('log(|A(s,t)|)')
    plt.grid(True)
    plt.axvline(x=1/alpha_prime - alpha_0/alpha_prime, color='r', linestyle=':', label='Pole at α(s)=1')
    plt.axvline(x=2/alpha_prime - alpha_0/alpha_prime, color='g', linestyle=':', label='Pole at α(s)=2')
    plt.legend()

    plt.tight_layout()
    plt.show()

    # --- 3. Plotting the Amplitude as a function of t (fixed s) ---
    fixed_s = 1.0 # Fixed s
    t_values = np.linspace(-3.0, 1.0, 500)
    t_complex_values = t_values + epsilon * 1j

    amplitude_magnitudes_t = []
    for t_val in t_complex_values:
        amp = veneziano_amplitude(fixed_s, t_val, alpha_0, alpha_prime)
        amplitude_magnitudes_t.append(abs(amp))

    plt.figure(figsize=(10, 6))
    plt.plot(t_values, np.log(amplitude_magnitudes_t), label='log(|A(s,t)|)')
    plt.title(f'Log of Veneziano Amplitude Magnitude vs. t (fixed s={fixed_s} GeV$^2$)')
    plt.xlabel('t (GeV$^2$)')
    plt.ylabel('log(|A(s,t)|)')
    plt.grid(True)
    # Poles in t-channel
    plt.axvline(x=1/alpha_prime - alpha_0/alpha_prime, color='r', linestyle=':', label='Pole at α(t)=1')
    plt.axvline(x=2/alpha_prime - alpha_0/alpha_prime, color='g', linestyle=':', label='Pole at α(t)=2')
    plt.legend()
    plt.tight_layout()
    plt.show()
