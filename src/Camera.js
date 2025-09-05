import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Function to start the camera
  const startCamera = async () => {
    // Clear any previous image
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStream(stream);
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  // Start the camera when the component mounts
  useEffect(() => {
    startCamera();

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Note: The dependency array is now empty to only run on mount and unmount

  // Function to capture the photo
  const handleCapture = () => {
    const video = videoRef.current;
    if (video) {
      // Create a canvas element to draw the image on
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas drawing to a JPEG image data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Update state with the captured image
      setCapturedImage(imageDataUrl);

      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Function to retake the photo
  const handleRetake = () => {
    startCamera();
  };

  return (
    <div>
      {capturedImage ? (
        // If an image is captured, show it and the Retake button
        <div>
          <h2>Captured Image:</h2>
          <img src={capturedImage} alt="Captured" style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }} />
          <button onClick={handleRetake} style={{ marginTop: '10px' }}>Retake Photo</button>
        </div>
      ) : (
        // Otherwise, show the live camera feed and Capture button
        <div>
          <h2>Live Camera Preview:</h2>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}
          />
          <button onClick={handleCapture} style={{ marginTop: '10px' }}>Capture Photo</button>
        </div>
      )}
    </div>
  );
};

export default Camera;