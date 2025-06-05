import cmath
import numpy as np
import matplotlib.pyplot as plt

try:
    from scipy.special import gamma as complex_gamma
except ImportError:
    print("SciPy library not found. Please install it using 'pip install scipy'")
    print("Cannot proceed without complex gamma function support.")
    exit()

def regge_trajectory(x, alpha_0, alpha_prime):
    """
    Defines a linear Regge trajectory.
    alpha(x) = alpha_0 + alpha_prime * x
    """
    return alpha_0 + alpha_prime * x

def veneziano_amplitude(s, t, alpha_0, alpha_prime):
    """
    Calculates the 4-point Veneziano scattering amplitude A(s,t).
    A(s,t) = Gamma(1 - alpha(s)) * Gamma(1 - alpha(t)) / Gamma(1 - alpha(s) - alpha(t))
    """
    alpha_s = regge_trajectory(s, alpha_0, alpha_prime)
    alpha_t = regge_trajectory(t, alpha_0, alpha_prime)

    arg_s = 1 - alpha_s
    arg_t = 1 - alpha_t
    arg_denom = 1 - alpha_s - alpha_t

    try:
        gamma_s = complex_gamma(arg_s)
        gamma_t = complex_gamma(arg_t)
        gamma_denom = complex_gamma(arg_denom)

        if cmath.isinf(gamma_s) or cmath.isinf(gamma_t) or gamma_denom == 0:
            return cmath.inf
        else:
            return (gamma_s * gamma_t) / gamma_denom
    except Exception:
        return cmath.nan # Return NaN for any unhandled numerical errors (e.g., domain errors)

def plot_veneziano_amplitude(alpha_0, alpha_prime, fixed_t=-0.2, s_range=(-1.0, 4.0), epsilon=0.01):
    """
    Plots the real and imaginary parts and log magnitude of the Veneziano amplitude
    as a function of s for fixed t, for given alpha_0 and alpha_prime.
    """
    s_values = np.linspace(s_range[0], s_range[1], 500)
    s_complex_values = s_values + epsilon * 1j # Add small imaginary part

    amplitude_real_parts = []
    amplitude_imag_parts = []
    amplitude_magnitudes = []

    for s_val in s_complex_values:
        amp = veneziano_amplitude(s_val, fixed_t, alpha_0, alpha_prime)
        amplitude_real_parts.append(amp.real)
        amplitude_imag_parts.append(amp.imag)
        amplitude_magnitudes.append(abs(amp))

    # Calculate theoretical pole positions for alpha(s) = 1, 2
    # alpha(s) = alpha_0 + alpha_prime * s = J => s = (J - alpha_0) / alpha_prime
    pole_s1 = (1 - alpha_0) / alpha_prime
    pole_s2 = (2 - alpha_0) / alpha_prime
    pole_s3 = (3 - alpha_0) / alpha_prime # Add a third pole for observation

    plt.figure(figsize=(12, 10))
    plt.suptitle(f'Veneziano Amplitude (α₀={alpha_0}, α\'={alpha_prime}) at fixed t={fixed_t} GeV²')

    # Plot Real and Imaginary Parts
    plt.subplot(2, 1, 1)
    plt.plot(s_values, amplitude_real_parts, label='Real Part', color='blue')
    plt.plot(s_values, amplitude_imag_parts, label='Imaginary Part', linestyle='--', color='orange')
    plt.xlabel('s (GeV$^2$)')
    plt.ylabel('Amplitude Value')
    plt.ylim(-10, 10) # Keep y-limits consistent for comparison
    plt.grid(True)
    plt.axvline(x=pole_s1, color='red', linestyle=':', label=r'Pole at $\alpha(s)=1$')
    plt.axvline(x=pole_s2, color='green', linestyle=':', label=r'Pole at $\alpha(s)=2$')
    if pole_s3 < s_range[1] and pole_s3 > s_range[0]: # Only plot if within range
        plt.axvline(x=pole_s3, color='purple', linestyle=':', label=r'Pole at $\alpha(s)=3$')
    plt.legend()
    plt.title('Real and Imaginary Parts')

    # Plot Log Magnitude
    plt.subplot(2, 1, 2)
    plt.plot(s_values, np.log10(amplitude_magnitudes), label=r'$\log_{10}(|A(s,t)|)$', color='black')
    plt.xlabel('s (GeV$^2$)')
    plt.ylabel(r'$\log_{10}(|A(s,t)|)$')
    plt.grid(True)
    plt.axvline(x=pole_s1, color='red', linestyle=':', label=r'Pole at $\alpha(s)=1$')
    plt.axvline(x=pole_s2, color='green', linestyle=':', label=r'Pole at $\alpha(s)=2$')
    if pole_s3 < s_range[1] and pole_s3 > s_range[0]:
        plt.axvline(x=pole_s3, color='purple', linestyle=':', label=r'Pole at $\alpha(s)=3$')
    plt.legend()
    plt.title('Logarithm of Magnitude (showing poles as sharp peaks)')

    plt.tight_layout(rect=[0, 0.03, 1, 0.96]) # Adjust layout to prevent suptitle overlap
    plt.show()

# --- Main execution block to vary parameters ---
if __name__ == "__main__":
    print("Exploring the effects of varying Regge parameters...")

    # Scenario 1: Default (Rho meson-like) parameters
    print("\nScenario 1: Default Rho meson-like parameters")
    plot_veneziano_amplitude(alpha_0=0.5, alpha_prime=0.9)

    # Scenario 2: Varying alpha_0 (intercept)
    # Let's increase alpha_0. This should shift poles to lower masses.
    print("\nScenario 2: Increased alpha_0 (0.8). Poles should shift left (lower s).")
    plot_veneziano_amplitude(alpha_0=0.8, alpha_prime=0.9)

    # Let's decrease alpha_0. This should shift poles to higher masses.
    print("\nScenario 3: Decreased alpha_0 (0.2). Poles should shift right (higher s).")
    plot_veneziano_amplitude(alpha_0=0.2, alpha_prime=0.9)

    # Scenario 3: Varying alpha_prime (slope)
    # Let's increase alpha_prime. This should make poles closer together.
    print("\nScenario 4: Increased alpha_prime (1.2). Poles should be closer together.")
    plot_veneziano_amplitude(alpha_0=0.5, alpha_prime=1.2)

    # Let's decrease alpha_prime. This should make poles further apart.
    print("\nScenario 5: Decreased alpha_prime (0.6). Poles should be further apart.")
    plot_veneziano_amplitude(alpha_0=0.5, alpha_prime=0.6)

    # Scenario 4: Extreme cases or combination
    print("\nScenario 6: High alpha_0, Low alpha_prime (e.g., very light particles, widely spaced)")
    plot_veneziano_amplitude(alpha_0=0.9, alpha_prime=0.5)

    print("\nScenario 7: Low alpha_0, High alpha_prime (e.g., heavier lowest state, closely spaced)")
    plot_veneziano_amplitude(alpha_0=0.1, alpha_prime=1.5)
