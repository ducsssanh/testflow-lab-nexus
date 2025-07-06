import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import { TechnicalDocument } from '@/types/lims';
import { useToast } from '@/hooks/use-toast';

interface TechnicalDocumentsSectionProps {
  documents: TechnicalDocument[];
  onViewDocument: (document: TechnicalDocument) => void;
}

const TechnicalDocumentsSection: React.FC<TechnicalDocumentsSectionProps> = ({
  documents,
  onViewDocument,
}) => {
  const { toast } = useToast();

  const handleViewDocument = async (document: TechnicalDocument) => {
    const loadingToast = toast({
      title: "Loading Document",
      description: "Retrieving document from database...",
    });

    try {
      const response = await fetch(`/api/v1/documents/${document.id}/view`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success) {
        const documentData = apiResponse.data;
        
        // For database-stored documents, expect base64 content
        if (documentData.content && documentData.mimeType) {
          const byteCharacters = atob(documentData.content);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: documentData.mimeType });
          const url = URL.createObjectURL(blob);
          
          // Open in new tab
          window.open(url, '_blank');
          
          // Clean up the URL after a delay
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          
          toast({
            title: "Document Opened",
            description: `${document.name} has been opened for viewing`,
          });
        } else {
          // Fallback to document viewer component if no content
          onViewDocument(document);
          toast({
            title: "Document Viewer",
            description: `Opening ${document.name} in document viewer`,
          });
        }
      } else {
        throw new Error(apiResponse.error?.message || 'Failed to load document');
      }
    } catch (error) {
      console.error('Failed to load document:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve document from database",
        variant: "destructive"
      });
      
      // Fallback to the document viewer component
      onViewDocument(document);
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu kỹ thuật</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Không có tài liệu kỹ thuật nào
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu kỹ thuật</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4" />
                <div>
                  <p className="font-medium text-sm">{document.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {document.type.toUpperCase()}
                    </Badge>
                    <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{new Date(document.uploadedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleViewDocument(document)}
                className="flex items-center space-x-2 ml-4"
              >
                <Eye className="h-4 w-4" />
                <span>Xem</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalDocumentsSection;
