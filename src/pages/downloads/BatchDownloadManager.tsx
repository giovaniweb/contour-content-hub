
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import BatchFileUploader from "@/components/downloads/BatchFileUploader";
import FileMetadataForm from "@/components/downloads/FileMetadataForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const ListDownloads: React.FC = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["downloads_storage"],
    queryFn: async () => {
      const { data } = await supabase
        .from("downloads_storage")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (isLoading) return <div>Carregando arquivos...</div>;
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {data.map((row) => (
        <Card key={row.id} className="mb-2">
          <CardHeader>
            <CardTitle>{row.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{row.description}</p>
            {row.thumbnail_url && (
              <img src={row.thumbnail_url} alt="" className="max-w-xs mb-2 mt-2 rounded shadow" />
            )}
            <div className="flex gap-2 items-center">
              <a
                href={`https://mksvzhgqnsjfolvskibq.supabase.co/storage/v1/object/public/${row.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Download
              </a>
              <span className="text-xs text-muted-foreground">{row.file_type}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{row.category}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const BatchDownloadManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  return (
    <AppLayout>
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Importação em Massa de Arquivos</h1>
        <Card>
          <CardHeader>
            <CardTitle>Upload em Lote de Arquivos</CardTitle>
          </CardHeader>
          <CardContent>
            {!showMetadataForm ? (
              <BatchFileUploader
                onComplete={(files) => {
                  setUploadedFiles(files.filter((f) => f.url));
                  setShowMetadataForm(true);
                }}
              />
            ) : (
              <FileMetadataForm
                uploadedFiles={uploadedFiles}
                onFinish={() => window.location.reload()}
              />
            )}
          </CardContent>
        </Card>
        <h2 className="text-xl font-semibold mt-8">Arquivos para Download</h2>
        <ListDownloads />
      </div>
    </AppLayout>
  );
};

export default BatchDownloadManager;
