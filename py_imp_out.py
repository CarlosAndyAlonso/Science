import math
import cmath # For complex numbers, especially if alpha(s) or alpha(t) could become negative or complex

# 1. Define the Regge trajectory function
def alpha(x, alpha_0, alpha_prime):
    return alpha_0 + alpha_prime * x

# 2. Implement the Gamma function
#    Python's 'math.gamma' works for real numbers.
#    For complex arguments, you might need to use a specialized library
#    or implement a known approximation/series expansion if you expect complex values.
#    For this example, we'll assume real arguments for simplicity.
#    If you need complex Gamma, the 'scipy.special.gamma' function (from SciPy library)
#    handles complex arguments well.

# Let's assume you have scipy installed for handling complex gamma
try:
    from scipy.special import gamma as complex_gamma
except ImportError:
    print("SciPy not found. Using math.gamma which only supports real arguments.")
    # Fallback if scipy is not available, but be aware of limitations
    complex_gamma = math.gamma

# 3. Implement the Veneziano Amplitude
def veneziano_amplitude(s, t, alpha_0, alpha_prime):
    # Calculate the Regge trajectories
    alpha_s = alpha(s, alpha_0, alpha_prime)
    alpha_t = alpha(t, alpha_0, alpha_prime)

    # Calculate the Gamma functions
    gamma_minus_alpha_s = complex_gamma(-alpha_s)
    gamma_minus_alpha_t = complex_gamma(-alpha_t)
    gamma_sum_alpha = complex_gamma(-alpha_s - alpha_t)

    # Calculate the amplitude
    # Be careful with division by zero if gamma_sum_alpha could be zero,
    # though for typical physical parameters, it generally won't be in the denominator.
    if gamma_sum_alpha == 0:
        # Handle this case, perhaps return a large number or raise an error
        return float('inf') # Or cmath.inf for complex infinity
    else:
        return (gamma_minus_alpha_s * gamma_minus_alpha_t) / gamma_sum_alpha

# --- Example Usage ---
if __name__ == "__main__":
    # Define some typical parameters for illustration
    alpha_0_rho = 0.5  # Approximate intercept for Rho meson trajectory
    alpha_prime_rho = 0.9  # Approximate slope for Rho meson trajectory (GeV^-2)

    # Example Mandelstam variables (in GeV^2)
    s_val = 1.0
    t_val = 0.5

    # Calculate the amplitude
    amplitude = veneziano_amplitude(s_val, t_val, alpha_0_rho, alpha_prime_rho)

    print(f"For s = {s_val} GeV^2, t = {t_val} GeV^2:")
    print(f"Alpha(s) = {alpha(s_val, alpha_0_rho, alpha_prime_rho)}")
    print(f"Alpha(t) = {alpha(t_val, alpha_0_rho, alpha_prime_rho)}")
    print(f"Veneziano Amplitude A(s,t) = {amplitude}")

    # You can also try varying s and t and plotting the amplitude
    # This would involve using libraries like matplotlib.
