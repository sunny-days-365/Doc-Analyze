
import { useState } from "react";
import { Search, Filter, Download, Eye, Trash2, FileText, Image, Calendar, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentListProps {
  documents: any[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "all" || 
                           (filterType === "pdf" && doc.type === "application/pdf") ||
                           (filterType === "image" && doc.type.startsWith("image/")) ||
                           (filterType === "text" && doc.type.startsWith("text/"));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sortBy === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });

  const getDocumentIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 bg-black/20 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder-slate-400"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF Documents</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="text">Text Files</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">
              {filteredDocuments.length} of {documents.length} documents
            </span>
          </div>
        </div>
      </Card>

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12 bg-black/20 border-white/10 text-center">
          <FileText className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {documents.length === 0 ? "No Documents Yet" : "No Documents Match Your Search"}
          </h3>
          <p className="text-slate-400">
            {documents.length === 0 
              ? "Upload your first document to get started with AI analysis."
              : "Try adjusting your search terms or filters."
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="group bg-black/20 border-white/10 hover:border-ai-primary/30 transition-all duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-ai-primary/20 rounded-lg flex items-center justify-center text-ai-primary">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{doc.name}</h3>
                      <p className="text-sm text-slate-400">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      doc.status === 'processed' 
                        ? 'bg-ai-success/20 text-ai-success' 
                        : 'bg-ai-warning/20 text-ai-warning'
                    }`}
                  >
                    {doc.status}
                  </Badge>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                  {doc.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doc.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs border-ai-secondary/30 text-ai-secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {doc.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      +{doc.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-ai-primary font-medium">
                      {Math.round(doc.confidence * 100)}%
                    </span>
                    <span>confidence</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="flex-1 text-ai-primary hover:bg-ai-primary/10">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost" className="text-ai-accent hover:bg-ai-accent/10">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-ai-danger hover:bg-ai-danger/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
