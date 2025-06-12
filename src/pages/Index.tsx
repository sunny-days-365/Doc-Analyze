
import { useState } from "react";
import { Upload, FileText, Brain, Search, Zap, BarChart3, Download, Eye, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentAnalysis from "@/components/DocumentAnalysis";
import DocumentList from "@/components/DocumentList";
import StatsOverview from "@/components/StatsOverview";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze' | 'documents'>('upload');
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleDocumentUploaded = (document: any) => {
    setUploadedDocuments(prev => [...prev, document]);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ai-dark via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-ai rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">DocuMind AI</h1>
                <p className="text-sm text-slate-400">Smart Document Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" className="border-ai-primary/30 text-ai-primary hover:bg-ai-primary/10">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-gradient-ai hover:opacity-90">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <StatsOverview documentsCount={uploadedDocuments.length} />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-black/20 rounded-xl backdrop-blur-sm border border-white/10">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-ai-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'analyze'
                ? 'bg-ai-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'documents'
                ? 'bg-ai-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Library</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'upload' && (
            <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
          )}

          {activeTab === 'analyze' && (
            <DocumentAnalysis documents={uploadedDocuments} />
          )}

          {activeTab === 'documents' && (
            <DocumentList documents={uploadedDocuments} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-black/20 border-white/10 hover:border-ai-primary/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-ai-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-ai-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-white">Smart Search</h3>
            </div>
            <p className="text-slate-400 mb-4">Find information across all your documents using AI-powered semantic search.</p>
            <Button variant="ghost" className="text-ai-secondary hover:bg-ai-secondary/10">
              Try Search
            </Button>
          </Card>

          <Card className="p-6 bg-black/20 border-white/10 hover:border-ai-accent/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-ai-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 text-ai-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white">Analytics</h3>
            </div>
            <p className="text-slate-400 mb-4">Get insights into your document patterns, topics, and processing metrics.</p>
            <Button variant="ghost" className="text-ai-accent hover:bg-ai-accent/10">
              View Analytics
            </Button>
          </Card>

          <Card className="p-6 bg-black/20 border-white/10 hover:border-ai-success/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-ai-success/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-ai-success" />
              </div>
              <h3 className="text-lg font-semibold text-white">Document Preview</h3>
            </div>
            <p className="text-slate-400 mb-4">Preview and interact with your processed documents in real-time.</p>
            <Button variant="ghost" className="text-ai-success hover:bg-ai-success/10">
              Preview Mode
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
