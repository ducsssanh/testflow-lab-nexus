
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { TechnicalDocument } from '@/types/lims';

interface DocumentViewerProps {
  document: TechnicalDocument;
  onBack: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onBack }) => {
  const renderDocumentContent = () => {
    if (document.type === 'pdf') {
      // For PDF files, we'll show an embedded viewer
      // In a real implementation, this would use a PDF viewer library
      return (
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">PDF Document Preview</p>
            <p className="text-sm text-gray-500">
              In a real implementation, this would show the PDF content
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Document: {document.name}
            </p>
          </div>
        </div>
      );
    }

    // For other document types (DOC, DOCX)
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">Document Preview</p>
          <p className="text-sm text-gray-500">
            Document type: {document.type.toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Document: {document.name}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Xem tài liệu</h2>
          <p className="text-gray-600">{document.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu kỹ thuật</CardTitle>
          <div className="text-sm text-gray-500">
            <p>Kích thước: {(document.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Loại: {document.type.toUpperCase()}</p>
            <p>Ngày tải lên: {new Date(document.uploadedAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </CardHeader>
        <CardContent>
          {renderDocumentContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentViewer;
