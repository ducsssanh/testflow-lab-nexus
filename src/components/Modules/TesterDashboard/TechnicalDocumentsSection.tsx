
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import { TechnicalDocument } from '@/types/lims';

interface TechnicalDocumentsSectionProps {
  documents: TechnicalDocument[];
  onViewDocument: (document: TechnicalDocument) => void;
}

const TechnicalDocumentsSection: React.FC<TechnicalDocumentsSectionProps> = ({
  documents,
  onViewDocument,
}) => {
  const handleViewDocument = async (document: TechnicalDocument) => {
    // TODO: REPLACE WITH REAL API CALL
    // API_INTEGRATION: Replace with actual document viewing endpoint
    // GET /api/v1/documents/${document.id}/view
    // This should either:
    // 1. Return a signed URL for direct viewing
    // 2. Stream the document content
    // 3. Open document in a viewer component
    
    // const response = await fetch(`/api/v1/documents/${document.id}/view`);
    // if (response.ok) {
    //   const documentUrl = await response.text(); // or response.blob() for direct content
    //   window.open(documentUrl, '_blank'); // or open in modal/viewer
    // } else {
    //   console.error('Failed to load document');
    // }

    onViewDocument(document);
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
          <p className="text-xs text-blue-600 text-center">
            💡 API Integration: Technical documents will be loaded from database when backend is connected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu kỹ thuật</CardTitle>
        <p className="text-xs text-blue-600">
          💡 API Integration: Document viewing will use signed URLs from backend storage (e.g., AWS S3, Supabase Storage)
        </p>
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
