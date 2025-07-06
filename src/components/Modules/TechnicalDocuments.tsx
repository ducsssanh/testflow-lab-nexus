
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Eye } from 'lucide-react';
import { TechnicalDocument } from '@/types/lims';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TechnicalDocumentsProps {
  documents: TechnicalDocument[];
  onDocumentsChange: (documents: TechnicalDocument[]) => void;
  canUpload?: boolean;
}

const TechnicalDocuments: React.FC<TechnicalDocumentsProps> = ({
  documents,
  onDocumentsChange,
  canUpload = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const newDocuments: TechnicalDocument[] = [];

    for (const file of Array.from(files)) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Lỗi định dạng file",
          description: `File ${file.name} không được hỗ trợ. Chỉ chấp nhận PDF, DOC, DOCX.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File quá lớn",
          description: `File ${file.name} vượt quá giới hạn 10MB.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        // Upload file to storage service
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('/api/v1/documents/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }
        
        const uploadResult = await uploadResponse.json();
        
        const document: TechnicalDocument = {
          id: uploadResult.id || (Date.now().toString() + Math.random().toString(36).substr(2, 9)),
          name: file.name,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('word') ? 'doc' : 'docx',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.id.toString(),
          url: uploadResult.url,
        };

        newDocuments.push(document);
      } catch (error) {
        toast({
          title: "Lỗi tải lên",
          description: `Không thể tải lên file ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newDocuments.length > 0) {
      onDocumentsChange([...documents, ...newDocuments]);
      toast({
        title: "Thành công",
        description: `Đã tải lên ${newDocuments.length} tài liệu kỹ thuật.`,
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    fileInputRef.current?.click();
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'doc': return 'DOC';
      case 'docx': return 'DOCX';
      default: return 'Document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (document: TechnicalDocument) => {
    // In a real implementation, this would open the document
    toast({
      title: "Xem tài liệu",
      description: `Mở tài liệu: ${document.name}`,
    });
  };

  const handleDownloadDocument = (document: TechnicalDocument) => {
    // In a real implementation, this would download the file
    toast({
      title: "Tải xuống",
      description: `Tải xuống: ${document.name}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tài liệu kỹ thuật</CardTitle>
          {canUpload && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                onClick={handleUploadClick}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Tải lên</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Chưa có tài liệu kỹ thuật nào được tải lên
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(document.type)}
                  <div>
                    <p className="font-medium text-sm">{document.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Badge variant="outline" className="text-xs">
                        {getFileTypeLabel(document.type)}
                      </Badge>
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>{new Date(document.uploadedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(document)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalDocuments;
