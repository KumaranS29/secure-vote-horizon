
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Camera, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { VerificationProgress } from '@/components/ui-custom/VerificationProgress';

const VerifyFace = () => {
  const navigate = useNavigate();
  const { user, updateUser, verifyFace } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
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
    
    // If user has already verified their face, redirect to dashboard
    if (user.faceVerified) {
      toast.success('Face already verified');
      navigate('/dashboard');
    } else {
      // Initialize camera
      startCamera();
    }
    
    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, navigate]);
  
  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      setStream(cameraStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };
  
  const retakeImage = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  const handleVerify = async () => {
    if (!capturedImage) {
      toast.error('Please capture your face image first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, you would send the image to the server for verification
      // For demo purposes, we'll simulate face verification with the verifyFace method
      const success = await verifyFace();
      
      if (success) {
        toast.success('Face verification successful');
        
        // Determine where to navigate based on user role
        if (user?.role === 'candidate' && !user.partyId) {
          navigate('/verify/party');
        } else if (user?.verified) {
          navigate('/dashboard');
        } else {
          navigate('/verification-pending');
        }
      } else {
        toast.error('Face verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Face verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen py-10 px-4">
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
                Please look at the camera and capture a clear photo of your face
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {!capturedImage && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-lg pointer-events-none"></div>
                  </>
                )}
                
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured face" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-2 justify-center">
                {!capturedImage ? (
                  <Button
                    type="button"
                    onClick={captureImage}
                    className="w-full"
                    disabled={!stream}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={retakeImage}
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>
                    
                    <Button
                      type="button"
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
                          Verify
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
              
              <div className="text-sm text-center text-muted-foreground mt-2">
                <p>Ensure your face is well-lit and clearly visible</p>
                <p>For demo purposes, all verifications will succeed</p>
              </div>
              
              <VerificationProgress />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default VerifyFace;
