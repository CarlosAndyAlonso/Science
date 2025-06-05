import math

# --- 1. Define Cylinder and Triangle Parameters ---
TARGET_DIAMETER = 7.0
TARGET_RADIUS = TARGET_DIAMETER / 2 # Radius is half of diameter
TARGET_HEIGHT = 35.0

# Triangle side lengths
LEG1 = 5.0
LEG2 = math.sqrt(24) # Approx 4.898979
HYPOTENUSE = 7.0

# Based on target dimensions and triangle legs
# We'll use LEG1 (5.0) for circumferential segments
# We'll use LEG2 (4.899) for vertical segments

# Calculate N_segments_around (horizontal)
circumference_target = 2 * math.pi * TARGET_RADIUS
N_SEGMENTS_AROUND = round(circumference_target / LEG1)
if N_SEGMENTS_AROUND < 3: # Ensure at least 3 segments for a meaningful circle
    N_SEGMENTS_AROUND = 3
# Ensure a reasonable minimum number of segments for visual approximation
if N_SEGMENTS_AROUND < 4:
    N_SEGMENTS_AROUND = 4

ACTUAL_RADIUS = (N_SEGMENTS_AROUND * LEG1) / (2 * math.pi)
ACTUAL_DIAMETER = ACTUAL_RADIUS * 2

# Calculate N_height (vertical)
N_HEIGHT_SEGMENTS = round(TARGET_HEIGHT / LEG2)
if N_HEIGHT_SEGMENTS < 1:
    N_HEIGHT_SEGMENTS = 1
ACTUAL_HEIGHT = N_HEIGHT_SEGMENTS * LEG2

print(f"Calculated Parameters:")
print(f"  Target Diameter: {TARGET_DIAMETER:.2f}, Target Height: {TARGET_HEIGHT:.2f}")
print(f"  Triangle Sides: ({LEG1:.3f}, {LEG2:.3f}, {HYPOTENUSE:.3f})")
print(f"  Segments Around: {N_SEGMENTS_AROUND} (Actual Diameter: {ACTUAL_DIAMETER:.2f})")
print(f"  Height Segments: {N_HEIGHT_SEGMENTS} (Actual Height: {ACTUAL_HEIGHT:.2f})")


# Output file names
OBJ_FILE = "string_cylinder.obj"
MTL_FILE = "string_cylinder.mtl"
MATERIAL_NAME_CYLINDER = "red_string_material"

# Store generated data
vertices = [] # List of (x, y, z) tuples
faces = []    # List of (v1, v2, v3) tuples (1-indexed vertex numbers)


# --- 2. Generate Vertices for the Cylinder ---
# We'll generate vertices in (x, y, z) coordinates.
# Z will represent height.
# For each 'level' (0 to N_HEIGHT_SEGMENTS), generate points around the circle.

for h_idx in range(N_HEIGHT_SEGMENTS + 1):
    z = h_idx * LEG2
    for s_idx in range(N_SEGMENTS_AROUND):
        angle = (s_idx / N_SEGMENTS_AROUND) * 2 * math.pi
        x = ACTUAL_RADIUS * math.cos(angle)
        y = ACTUAL_RADIUS * math.sin(angle)
        vertices.append((x, y, z))

# Add a central vertex for the top and bottom caps for easier triangulation
# Bottom center
vertices.append((0.0, 0.0, 0.0))
bottom_center_v_idx = len(vertices)

# Top center
vertices.append((0.0, 0.0, ACTUAL_HEIGHT))
top_center_v_idx = len(vertices)

# --- 3. Generate Faces for the Cylinder ---
# Faces are 1-indexed in OBJ files, so we'll adjust later.
# For side faces:
# Each quad is formed by 4 vertices at two adjacent levels and two adjacent segments.
# v1 = (h_idx, s_idx)
# v2 = (h_idx, s_idx + 1)
# v3 = (h_idx + 1, s_idx + 1)
# v4 = (h_idx + 1, s_idx)
# This quad is then split into two triangles using the hypotenuse.

for h_idx in range(N_HEIGHT_SEGMENTS):
    for s_idx in range(N_SEGMENTS_AROUND):
        # Calculate 1-indexed vertex numbers for the current quad
        v1_idx = h_idx * N_SEGMENTS_AROUND + s_idx + 1
        v2_idx = h_idx * N_SEGMENTS_AROUND + (s_idx + 1) % N_SEGMENTS_AROUND + 1
        v3_idx = (h_idx + 1) * N_SEGMENTS_AROUND + (s_idx + 1) % N_SEGMENTS_AROUND + 1
        v4_idx = (h_idx + 1) * N_SEGMENTS_AROUND + s_idx + 1

        # Triangle 1 (using v1, v2, v4 - assumes hypotenuse v2-v4)
        faces.append((v1_idx, v2_idx, v4_idx))
        # Triangle 2 (using v2, v3, v4)
        faces.append((v2_idx, v3_idx, v4_idx))

# Top Cap Faces:
# Connect top_center_v_idx to each segment of the top circle
top_level_start_v_idx = N_HEIGHT_SEGMENTS * N_SEGMENTS_AROUND
for s_idx in range(N_SEGMENTS_AROUND):
    v1 = top_center_v_idx
    v2 = top_level_start_v_idx + s_idx + 1
    v3 = top_level_start_v_idx + (s_idx + 1) % N_SEGMENTS_AROUND + 1
    faces.append((v1, v3, v2)) # Order for correct face normal (outwards)

# Bottom Cap Faces:
# Connect bottom_center_v_idx to each segment of the bottom circle
for s_idx in range(N_SEGMENTS_AROUND):
    v1 = bottom_center_v_idx
    v2 = s_idx + 1
    v3 = (s_idx + 1) % N_SEGMENTS_AROUND + 1
    faces.append((v1, v2, v3)) # Order for correct face normal (outwards)

# --- 4. Create MTL file ---
with open(MTL_FILE, "w") as f_mtl:
    f_mtl.write(f"newmtl {MATERIAL_NAME_CYLINDER}\n")
    f_mtl.write("Kd 1.0 0.0 0.0\n") # Diffuse Red color (RGB 1.0 0.0 0.0)

# --- 5. Write OBJ file ---
with open(OBJ_FILE, "w") as f_obj:
    f_obj.write(f"# Generated 3D String Cylinder\n")
    f_obj.write(f"mtllib {MTL_FILE}\n\n")

    f_obj.write(f"# Cylinder Vertices ({len(vertices)} total)\n")
    for v in vertices:
        f_obj.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")

    f_obj.write(f"\n# Cylinder Faces ({len(faces)} total)\n")
    f_obj.write(f"usemtl {MATERIAL_NAME_CYLINDER}\n")
    for f in faces:
        f_obj.write(f"f {f[0]} {f[1]} {f[2]}\n")

print(f"\nOBJ file '{OBJ_FILE}' and MTL file '{MTL_FILE}' created successfully.")
print(f"You can transfer these files to your computer and open {OBJ_FILE} in a 3D viewer (e.g., Blender, MeshLab, online OBJ viewer).")
print(f"Actual Cylinder Dimensions: Diameter={ACTUAL_DIAMETER:.2f}, Height={ACTUAL_HEIGHT:.2f}")

