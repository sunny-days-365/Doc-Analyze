
import { useState } from "react";
import { Brain, TrendingUp, Tag, Clock, Zap, FileText, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentAnalysisProps {
  documents: any[];
}

const DocumentAnalysis = ({ documents }: DocumentAnalysisProps) => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAdvancedAnalysis = async (doc: any) => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
  };

  const mockInsights = [
    {
      type: 'sentiment',
      title: 'Sentiment Analysis',
      value: 'Positive',
      confidence: 0.87,
      description: 'Overall positive tone detected throughout the document'
    },
    {
      type: 'topics',
      title: 'Key Topics',
      value: 'Business Strategy',
      confidence: 0.92,
      description: 'Primary focus on strategic planning and growth initiatives'
    },
    {
      type: 'entities',
      title: 'Named Entities',
      value: '12 Organizations',
      confidence: 0.95,
      description: 'Companies, institutions, and business entities identified'
    },
    {
      type: 'complexity',
      title: 'Reading Level',
      value: 'Graduate',
      confidence: 0.89,
      description: 'Document requires advanced reading comprehension'
    }
  ];

  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <Card className="p-12 bg-black/20 border-white/10 text-center">
          <Brain className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Documents to Analyze</h3>
          <p className="text-slate-400">Upload some documents first to see AI analysis results.</p>
        </Card>
      ) : (
        <>
          {/* Document Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Select Document for Analysis</h3>
            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedDocument?.id === doc.id
                      ? 'bg-ai-primary/10 border-ai-primary'
                      : 'bg-black/20 border-white/10 hover:border-ai-primary/50'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-ai-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-ai-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{doc.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {doc.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-ai-primary font-medium">
                        {Math.round(doc.confidence * 100)}% Confidence
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Analysis Results */}
          {selectedDocument && (
            <Card className="bg-black/20 border-white/10">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">AI Analysis Results</h3>
                    <p className="text-slate-400">{selectedDocument.name}</p>
                  </div>
                  <Button
                    onClick={() => runAdvancedAnalysis(selectedDocument)}
                    disabled={analyzing}
                    className="bg-gradient-ai hover:opacity-90"
                  >
                    {analyzing ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Run Advanced Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <Tabs defaultValue="insights" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-black/20">
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="extraction">Text Extraction</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockInsights.map((insight, index) => (
                        <Card key={index} className="p-4 bg-white/5 border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-white">{insight.title}</h4>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4 text-ai-accent" />
                              <span className="text-sm text-ai-accent">
                                {Math.round(insight.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-ai-primary mb-1">
                            {insight.value}
                          </p>
                          <p className="text-sm text-slate-400">{insight.description}</p>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-4 bg-white/5 border-white/10">
                      <h4 className="font-medium text-white mb-3">Key Insights</h4>
                      <ul className="space-y-2">
                        {selectedDocument.insights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2 text-slate-300">
                            <TrendingUp className="w-4 h-4 text-ai-success" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </TabsContent>

                  <TabsContent value="summary">
                    <Card className="p-6 bg-white/5 border-white/10">
                      <h4 className="font-medium text-white mb-4">AI-Generated Summary</h4>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedDocument.summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedDocument.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="border-ai-primary/30 text-ai-primary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="extraction">
                    <Card className="p-6 bg-white/5 border-white/10">
                      <h4 className="font-medium text-white mb-4">Extracted Text</h4>
                      <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                          {selectedDocument.extractedText}
                        </pre>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentAnalysis;
