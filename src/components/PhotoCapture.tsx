interface PhotoCaptureProps {
  file: File | null;
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

export function PhotoCapture({ file, previewUrl, onChange }: PhotoCaptureProps) {
  return (
    <div className="photo-capture">
      <label className="field-label" htmlFor="photo-input">
        Photo evidence <span className="required">*</span>
      </label>
      <label className={file ? "photo-drop has-photo" : "photo-drop"} htmlFor="photo-input">
        {previewUrl ? (
          <img src={previewUrl} alt="Selected civic issue" />
        ) : (
          <>
            <span className="upload-icon" aria-hidden="true">↥</span>
            <strong>Choose or take a photo</strong>
            <span>Use a clear image of the issue</span>
          </>
        )}
      </label>
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {file && (
        <button type="button" className="text-button" onClick={() => onChange(null)}>
          Remove photo
        </button>
      )}
    </div>
  );
}