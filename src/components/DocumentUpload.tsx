
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUploadProps {
  onDocumentUploaded: (document: any) => void;
}

const DocumentUpload = ({ onDocumentUploaded }: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload documents.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    for (const file of acceptedFiles) {
      console.log('Processing file:', file.name);
      
      // Simulate AI processing with progress
      const processingSteps = [
        { step: 'Uploading file...', progress: 20 },
        { step: 'Extracting text...', progress: 40 },
        { step: 'AI analysis...', progress: 60 },
        { step: 'Generating summary...', progress: 80 },
        { step: 'Saving to database...', progress: 90 },
        { step: 'Finalizing...', progress: 100 }
      ];

      for (const { step, progress: stepProgress } of processingSteps) {
        setProgress(stepProgress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Save document to Supabase
      try {
        const { data: documentData, error } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            name: file.name,
            file_size: file.size,
            file_type: file.type,
            summary: 'This document has been successfully processed by our AI engine. Key topics include business strategy, financial analysis, and operational improvements.',
            extracted_text: 'Sample extracted text from the document...',
            confidence: 0.95,
            tags: ['business', 'strategy', 'analysis'],
            insights: [
              'Document contains financial projections',
              'Strategic recommendations identified', 
              'Key performance metrics mentioned'
            ],
            status: 'processed'
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving document:', error);
          toast({
            title: "Upload Error",
            description: "Failed to save document. Please try again.",
            variant: "destructive",
          });
          continue;
        }

        const processedDoc = {
          ...documentData,
          uploadedAt: new Date(documentData.created_at),
        };

        setUploadedFiles(prev => [...prev, processedDoc]);
        onDocumentUploaded(processedDoc);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Upload Error", 
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    setProgress(0);

    toast({
      title: "Documents Processed Successfully",
      description: `${acceptedFiles.length} document(s) have been analyzed and saved to your library.`,
    });
  }, [onDocumentUploaded, toast, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    disabled: uploading
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card
        {...getRootProps()}
        className={`relative p-12 bg-black/20 border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-ai-primary bg-ai-primary/5'
            : uploading
            ? 'border-ai-accent bg-ai-accent/5'
            : 'border-white/20 hover:border-ai-primary/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-ai-accent animate-spin" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">Processing Documents...</p>
                <p className="text-slate-400">AI is analyzing your documents</p>
                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-slate-500 mt-2">{progress}% complete</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="floating-animation">
                <Upload className="w-16 h-16 mx-auto text-ai-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">
                  {isDragActive ? 'Drop your documents here' : 'Upload Documents for AI Analysis'}
                </h3>
                <p className="text-slate-400">
                  Drag & drop your files here, or click to browse
                </p>
                <p className="text-sm text-slate-500">
                  Supports PDF, Images, Word docs, and Text files
                </p>
              </div>
              <Button className="bg-gradient-ai hover:opacity-90">
                Choose Files
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Recently Processed</h3>
          <div className="grid gap-4">
            {uploadedFiles.slice(-3).map((file) => (
              <Card key={file.id} className="p-4 bg-black/20 border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ai-success/20 rounded-lg flex items-center justify-center">
                      {file.file_type.startsWith('image/') ? (
                        <Image className="w-5 h-5 text-ai-success" />
                      ) : (
                        <FileText className="w-5 h-5 text-ai-success" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-sm text-slate-400">
                        Processed • {Math.round(file.file_size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-ai-success" />
                    <span className="text-sm text-ai-success font-medium">
                      {Math.round(file.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-slate-300">{file.summary}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
