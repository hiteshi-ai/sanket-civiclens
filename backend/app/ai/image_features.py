import io
import math
import numpy as np
from PIL import Image
from typing import Optional, List

def extract_image_features(image_bytes: bytes) -> Optional[np.ndarray]:
    """
    Extracts a deterministic, normalized color/texture feature vector from image bytes
    using 32-bin HSV color histogram and Sobel-like gradient energy.
    No synthetic values or random numbers used.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = img.resize((128, 128), Image.Resampling.BILINEAR)
        
        # Convert to HSV
        hsv_img = img.convert('HSV')
        hsv_arr = np.array(hsv_img, dtype=np.float32) / 255.0
        
        # 16 bins for Hue, 8 bins for Saturation, 8 bins for Value
        h_hist, _ = np.histogram(hsv_arr[:, :, 0], bins=16, range=(0.0, 1.0))
        s_hist, _ = np.histogram(hsv_arr[:, :, 1], bins=8, range=(0.0, 1.0))
        v_hist, _ = np.histogram(hsv_arr[:, :, 2], bins=8, range=(0.0, 1.0))
        
        # Gray gradient energy
        gray_arr = np.array(img.convert('L'), dtype=np.float32) / 255.0
        dx = np.diff(gray_arr, axis=1)
        dy = np.diff(gray_arr, axis=0)
        grad_mag = np.sqrt(dx[:-1, :]**2 + dy[:, :-1]**2)
        grad_hist, _ = np.histogram(grad_mag, bins=16, range=(0.0, 1.0))
        
        # Concatenate and normalize
        vec = np.concatenate([h_hist, s_hist, v_hist, grad_hist]).astype(np.float32)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec
    except Exception:
        return None

def compute_cosine_similarity(vec1: Optional[np.ndarray], vec2: Optional[np.ndarray]) -> Optional[float]:
    """
    Computes genuine cosine similarity between two feature vectors.
    Returns None if either vector cannot be extracted.
    """
    if vec1 is None or vec2 is None:
        return None
    dot = float(np.dot(vec1, vec2))
    norm1 = float(np.linalg.norm(vec1))
    norm2 = float(np.linalg.norm(vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    sim = dot / (norm1 * norm2)
    # Cosine similarity for non-negative histograms is in [0, 1]
    return max(0.0, min(1.0, round(sim, 3)))
