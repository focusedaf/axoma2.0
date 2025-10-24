"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Capture, type CaptureHandle } from "./capture";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Camera,
  Upload,
} from "lucide-react";

const CLOUDINARY_CLOUD_NAME = "";
const CLOUDINARY_UPLOAD_PRESET = "";

const instructions = [
  "There should be proper lighting in the room",
  "Face should not be covered with anything",
  "Don't wear anything that can cause glare in the images",
  "Position yourself directly in front of the camera, maintaining eye level",
  "Ensure stable internet connection - test beforehand to avoid disconnections",
];

enum CaptureState {
  Idle,
  Captured,
  Uploading,
  Success,
  Error,
}

const PreExamSetup = () => {
  const cameraRef = useRef<CaptureHandle>(null);

  const [captureState, setCaptureState] = useState(CaptureState.Idle);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async () => {
    setCapturedImage(null);
    setError(null);
    setUploadSuccessUrl(null);
    setIsConfirmed(false);

    try {
      const imageDataUrl = await cameraRef.current?.capture();
      if (!imageDataUrl)
        throw new Error("Could not capture image from camera.");
      setCapturedImage(imageDataUrl);
      setCaptureState(CaptureState.Captured);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setCaptureState(CaptureState.Error);
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) {
      setError("No image to upload.");
      setCaptureState(CaptureState.Error);
      return;
    }
    setCaptureState(CaptureState.Uploading);
    setError(null);
    setUploadSuccessUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", capturedImage);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Cloudinary upload failed.");

      const data = await response.json();
      setUploadSuccessUrl(data.secure_url);
      setCaptureState(CaptureState.Success);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setCaptureState(CaptureState.Error);
    }
  };

  const handleRetake = () => {
    setCaptureState(CaptureState.Idle);
    setCapturedImage(null);
    setIsConfirmed(false);
    setError(null);
    setUploadSuccessUrl(null);
  };

  const isLoading = captureState === CaptureState.Uploading;
  const showCamera = captureState === CaptureState.Idle || isLoading;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <Card className="w-full max-w-7xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Instructions Before Beginning the Exam
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col justify-between">
              <ol className="list-decimal list-inside space-y-5 text-lg text-muted-foreground">
                {instructions.map((instr, i) => (
                  <li key={i}>{instr}</li>
                ))}
              </ol>
            </div>

            
            <div className="flex flex-col items-center justify-center relative">
              <div className="w-full max-w-md relative">
                <div className="relative  w-full rounded-lg  overflow-hidden">
                  {(captureState === CaptureState.Idle || isLoading) && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
                      {captureState === CaptureState.Idle && (
                        <p className="text-white font-semibold text-lg">
                          Click Capture when ready
                        </p>
                      )}
                      {isLoading && (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-10 w-10 animate-spin text-white mb-2" />
                          <span className="text-white font-medium">
                            Uploading...
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {showCamera && <Capture ref={cameraRef} />}
                  {capturedImage && !showCamera && (
                    <img
                      src={capturedImage}
                      alt="Captured preview"
                      className="w-200 h-100 object-cover"
                    />
                  )}

               
                  {captureState === CaptureState.Idle && (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={handleCapture}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Capture
                    </Button>
                  )}
                </div>
              </div>

              
              {captureState === CaptureState.Captured && (
                <div className="w-full max-w-md mt-4 p-4 border rounded-lg bg-muted space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={isConfirmed}
                      onCheckedChange={(checked) =>
                        setIsConfirmed(checked as boolean)
                      }
                    />
                    <Label htmlFor="terms" className="text-base">
                      I confirm my image meets all the guidelines.
                    </Label>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      size="default"
                      onClick={handleUpload}
                      disabled={!isConfirmed}
                      className="w-1/2"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      size="default"
                      variant="outline"
                      onClick={handleRetake}
                      className="w-1/2"
                    >
                      Retake
                    </Button>
                  </div>
                </div>
              )}

          
              {captureState === CaptureState.Success && uploadSuccessUrl && (
                <Alert
                  variant="default"
                  className="bg-green-50 border-green-300 text-green-800 mt-4"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Upload Successful!</AlertTitle>
                  <AlertDescription className="break-all">
                    Your image has been saved.
                  </AlertDescription>
                  <Button
                    variant="link"
                    onClick={handleRetake}
                    className="p-0 h-auto mt-2 text-green-800"
                  >
                    Capture a new image
                  </Button>
                </Alert>
              )}

           
              {captureState === CaptureState.Error && error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Upload Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  <Button
                    variant="outline"
                    onClick={handleRetake}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreExamSetup;
