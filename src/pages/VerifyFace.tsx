
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Camera, CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

const VerifyFace = () => {
  const navigate = useNavigate();
  const { user, verifyFace } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }
    
    // If user has already verified face, redirect to dashboard
    if (user.faceVerified) {
      toast.success('Face already verified');
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    // Clean up video stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  useEffect(() => {
    // Start countdown if in capture mode
    if (captureMode && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (captureMode && countdown === 0 && !capturedImage) {
      // Capture image when countdown reaches 0
      captureImage();
    }
  }, [captureMode, countdown, capturedImage]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCaptureMode(true);
      setCountdown(3);
      
      // Simulate face detection after a delay
      setTimeout(() => {
        setFaceDetected(true);
      }, 1500);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please grant camera permissions.');
    }
  };
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !faceDetected) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    
    // Stop camera stream
    const stream = video.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
    setCaptureMode(false);
    setFaceDetected(false);
  };
  
  const handleVerify = async () => {
    if (!capturedImage) return;
    
    setIsLoading(true);
    
    try {
      // Verify face using the captured image
      const success = await verifyFace();
      
      if (success) {
        toast.success('Face verification successful');
        navigate('/dashboard');
      } else {
        toast.error('Face verification failed. Please try again.');
        resetCapture();
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please try again.');
      resetCapture();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-muted/30 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Face Verification</CardTitle>
              <CardDescription className="text-center">
                {!captureMode 
                  ? 'Verify your identity using facial recognition'
                  : !capturedImage
                    ? `Get ready to capture ${countdown > 0 ? `in ${countdown}...` : 'now!'}`
                    : 'Confirm your face image'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                {!captureMode && !capturedImage && (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>

              <div className="relative rounded-lg overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                {captureMode && !capturedImage ? (
                  <>
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover" 
                      muted
                      playsInline
                    />
                    {faceDetected && (
                      <div className="absolute inset-0 border-4 border-green-500 opacity-60 flex items-center justify-center">
                        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                          Face Detected
                        </div>
                      </div>
                    )}
                    {countdown > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 text-white text-6xl font-bold rounded-full w-20 h-20 flex items-center justify-center">
                          {countdown}
                        </div>
                      </div>
                    )}
                  </>
                ) : capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>Camera preview will appear here</p>
                    <p className="text-sm mt-1">Click "Start Camera" to begin</p>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="text-sm text-center text-muted-foreground mt-2">
                <p>
                  For the actual implementation, a real facial recognition AI would be used.
                  This demo will automatically verify after capture.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              {!captureMode && !capturedImage ? (
                <Button
                  className="w-full"
                  onClick={startCamera}
                >
                  Start Camera
                </Button>
              ) : capturedImage ? (
                <>
                  <Button
                    variant="outline"
                    onClick={resetCapture}
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button
                    onClick={handleVerify}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm
                      </>
                    )}
                  </Button>
                </>
              ) : null}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyFace;
