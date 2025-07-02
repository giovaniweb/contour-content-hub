
import { useEffect, useRef, useReducer, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase, SUPABASE_BASE_URL } from "@/integrations/supabase/client";
import { z } from "zod";
import { useEquipments } from "@/hooks/useEquipments";
import { useExtractedData, ExtractedData as HookExtractedData } from "./useExtractedData";
import { useUploadHandler } from "./useUploadHandler";
import { unifiedDocumentService } from "@/services/unifiedDocuments";

// Define form schema
export const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título precisa ter pelo menos 3 caracteres" }),
  descricao: z.string().optional(),
  equipamento_id: z.string().optional(),
  idioma_original: z.string().default("pt"),
  link_dropbox: z.string().url({ message: "Link inválido" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseScientificArticleFormProps {
  articleData?: any; // Consider defining a specific type for articleData
  onSuccess: (data?: any) => void;
  onCancel: () => void;
  isOpen?: boolean; // Could be managed by the reducer if form is always in dialog
  forceClearState?: boolean;
}

type FormStatus =
  | "IDLE"
  | "INITIALIZING"
  | "FILE_SELECTED" // User selected a file, awaiting processing
  | "AI_PROCESSING" // File is being processed by AI (includes upload + AI extraction)
  | "READY_TO_SUBMIT" // AI processing done OR editing existing data OR manual entry
  | "SUBMITTING" // Form data being sent to backend
  | "SUCCESS" // Submission successful
  | "ERROR"; // An error occurred

interface ReducerState {
  status: FormStatus;
  articleIdToEdit?: string | null; // ID of the article being edited
  file?: File | null;
  fileUrl?: string | null; // URL of the uploaded file (from storage or existing link_dropbox)
  isProcessingAi: boolean; // Specifically for AI step from useUploadHandler
  processingProgressMessage?: string | null; // Progress message from useUploadHandler
  aiProcessingFailed: boolean; // From useUploadHandler
  submissionError?: string | null;
  uploadError?: string | null; // Error from useUploadHandler
  isReplacingFile: boolean; // True if user intends to replace the existing file
  originalFilePath?: string | null; // Store the original file_path when editing
}

type ReducerAction =
  | { type: "INITIALIZE_FORM"; payload?: any } // articleData
  | { type: "INITIALIZATION_COMPLETE"; payload?: { fileUrl?: string; originalFilePath?: string } }
  | { type: "FILE_INPUT_CHANGE"; payload: File }
  | { type: "FILE_PROCESSING_START" }
  | { type: "FILE_PROCESSING_SUCCESS"; payload: { extractedData: HookExtractedData; newFileUrl?: string } }
  | { type: "FILE_PROCESSING_FAILURE"; payload: string }
  | { type: "SET_UPLOAD_ERROR"; payload: string | null }
  | { type: "UPDATE_PROCESSING_PROGRESS"; payload: string | null }
  | { type: "SUBMIT_FORM_DATA" }
  | { type: "SUBMISSION_COMPLETE"; payload: any } // savedArticleData
  | { type: "SUBMISSION_FAILED"; payload: string }
  | { type: "CANCEL_FORM" }
  | { type: "CLEAR_FILE" }
  | { type: "RESET_FORM_STATE" }
  | { type: "INITIATE_REPLACE_FILE" }; // User clicked "Replace PDF" button

const initialState: ReducerState = {
  status: "IDLE",
  articleIdToEdit: null,
  file: null,
  fileUrl: null,
  isProcessingAi: false,
  processingProgressMessage: null,
  aiProcessingFailed: false,
  submissionError: null,
  uploadError: null,
  isReplacingFile: false,
  originalFilePath: null,
};

function formReducer(state: ReducerState, action: ReducerAction): ReducerState {
  console.log(`[FORM_REDUCER] Action: ${action.type}`, action.payload || '');
  switch (action.type) {
    case "INITIALIZE_FORM":
      return {
        ...initialState, // Reset most things
        status: "INITIALIZING",
        articleIdToEdit: action.payload?.id || null,
        originalFilePath: action.payload?.file_path || null, // Store original file_path
      };
    case "INITIALIZATION_COMPLETE":
      return {
        ...state,
        status: "READY_TO_SUBMIT",
        fileUrl: action.payload?.fileUrl || state.fileUrl, // This is the display/initial URL
        // originalFilePath is already set in INITIALIZE_FORM if editing
      };
    case "FILE_INPUT_CHANGE": // This is when a new file is selected, possibly for replacement
      return {
        ...state,
        status: "FILE_SELECTED", // Will trigger AI processing
        file: action.payload,
        fileUrl: null, // New file means new URL eventually
        uploadError: null,
        aiProcessingFailed: false,
        submissionError: null,
      };
    case "FILE_PROCESSING_START":
      return {
        ...state,
        status: "AI_PROCESSING",
        isProcessingAi: true,
        aiProcessingFailed: false,
        uploadError: null,
      };
    case "FILE_PROCESSING_SUCCESS":
      return {
        ...state,
        status: "READY_TO_SUBMIT",
        isProcessingAi: false,
        fileUrl: action.payload.newFileUrl || state.fileUrl, // Keep old if new one not provided by handler
      };
    case "FILE_PROCESSING_FAILURE":
      return {
        ...state,
        status: "READY_TO_SUBMIT", // Still ready, but with error
        isProcessingAi: false,
        aiProcessingFailed: true,
        uploadError: action.payload, // Specific AI processing error
      };
    case "SET_UPLOAD_ERROR": // For general upload errors from useUploadHandler
        return { ...state, uploadError: action.payload, status: state.status === "AI_PROCESSING" ? "READY_TO_SUBMIT" : state.status };
    case "UPDATE_PROCESSING_PROGRESS":
        return { ...state, processingProgressMessage: action.payload };
    case "INITIATE_REPLACE_FILE":
      return {
        ...state,
        isReplacingFile: true,
        // UI should now allow file input. Old file is still state.originalFilePath
        // Clearing current file selection to allow new one:
        file: null,
        fileUrl: null,
        status: "IDLE", // Or a new status e.g., "AWAITING_REPLACEMENT_FILE"
      };
    case "SUBMIT_FORM_DATA":
      return {
        ...state,
        status: "SUBMITTING",
        submissionError: null,
      };
    case "SUBMISSION_COMPLETE":
      return {
        ...state,
        status: "SUCCESS",
        // file: null, // Keep file/fileUrl for display until full reset?
        // fileUrl: null,
      };
    case "SUBMISSION_FAILED":
      return {
        ...state,
        status: "READY_TO_SUBMIT", // Or "ERROR" if unrecoverable
        submissionError: action.payload,
      };
    case "CANCEL_FORM":
    case "RESET_FORM_STATE":
      return { ...initialState, status: "IDLE" }; // Full reset
    case "CLEAR_FILE":
      return {
        ...state,
        file: null,
        fileUrl: null, // Also clear URL if file is cleared
        uploadError: null,
        aiProcessingFailed: false,
        // status remains READY_TO_SUBMIT or IDLE based on previous state, or reset explicitly if needed
      };
    default:
      return state;
  }
}

export function useScientificArticleForm({
  articleData, // This is the initial data for editing
  onSuccess,
  onCancel,
  isOpen = true, // Assuming isOpen controls dialog visibility externally
  forceClearState = false,
}: UseScientificArticleFormProps) {
  const instanceId = useRef(`form-instance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const [state, dispatch] = useReducer(formReducer, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      equipamento_id: "",
      idioma_original: "pt",
      link_dropbox: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { equipments } = useEquipments();

  const {
    suggestedTitle,
    suggestedDescription,
    extractedKeywords,
    extractedResearchers,
    handleExtractedData,
    resetExtractedData,
  } = useExtractedData({
    // Pass articleData directly if its structure matches what useExtractedData expects
    initialData: articleData,
    forceClearState: forceClearState || state.status === "IDLE", // Reset extracted if form is idle
  });

  const uploadHandler = useUploadHandler({
    onExtractedData: (data) => {
      handleExtractedData(data); // Propagate to useExtractedData
      dispatch({ type: "FILE_PROCESSING_SUCCESS", payload: { extractedData: data, newFileUrl: uploadHandler.fileUrl } });
    },
    onError: (message) => {
      dispatch({ type: "FILE_PROCESSING_FAILURE", payload: message });
    },
    onReset: () => {
      // This onReset from useUploadHandler can be used to clear its specific errors/progress
      dispatch({ type: "SET_UPLOAD_ERROR", payload: null });
      dispatch({ type: "UPDATE_PROCESSING_PROGRESS", payload: null });
      resetExtractedData(); // Also reset extracted data
    },
    forceClearState: forceClearState || state.status === "IDLE",
  });

  // Effect for initializing or resetting the form when articleData or forceClearState changes
  useEffect(() => {
    console.log(`[${instanceId.current}] useEffect: articleData or forceClearState change. Current status: ${state.status}`);
    if (forceClearState) {
      console.log(`[${instanceId.current}] Force clear state triggered.`);
      dispatch({ type: "RESET_FORM_STATE" });
      form.reset(initialState); // Reset react-hook-form
      uploadHandler.resetUploadState(); // Reset upload handler state
      resetExtractedData(); // Reset extracted data hook
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (articleData) {
      console.log(`[${instanceId.current}] Initializing with article data:`, articleData.id);
      dispatch({ type: "INITIALIZE_FORM", payload: articleData });
      form.reset({
        titulo: articleData.titulo_extraido || "",
        descricao: articleData.texto_completo || "",
        equipamento_id: articleData.equipamento_id || "",
        idioma_original: articleData.idioma_original || "pt",
        link_dropbox: articleData.file_path ? `${SUPABASE_BASE_URL}/storage/v1/object/public/documents/${articleData.file_path}` : articleData.link_dropbox || "",
      });
      const initialFileUrl = articleData.file_path ? `${SUPABASE_BASE_URL}/storage/v1/object/public/documents/${articleData.file_path}` : articleData.link_dropbox || null;
      dispatch({ type: "INITIALIZATION_COMPLETE", payload: { fileUrl: initialFileUrl } });
      uploadHandler.setFileUrl(initialFileUrl); // Sync with upload handler

    } else {
      console.log(`[${instanceId.current}] Initializing for new article.`);
      dispatch({ type: "RESET_FORM_STATE" }); // Ensure it's IDLE if no data
      form.reset(initialState);
      uploadHandler.resetUploadState();
      resetExtractedData();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [articleData, forceClearState, form.reset, uploadHandler.resetUploadState, resetExtractedData, uploadHandler.setFileUrl]);


  // Effect to auto-process file when selected
  useEffect(() => {
    if (state.status === "FILE_SELECTED" && state.file && !uploadHandler.isProcessing) {
      console.log(`[${instanceId.current}] New file detected, auto-processing...`);
      dispatch({ type: "FILE_PROCESSING_START" });
      uploadHandler.handleFileUpload(); // This is async
    }
  }, [state.status, state.file, uploadHandler.isProcessing, uploadHandler.handleFileUpload]);

  // Effect to update react-hook-form when AI suggestions change
  useEffect(() => {
    if (suggestedTitle) {
      console.log(`[${instanceId.current}] Updating RHF title with suggestion:`, suggestedTitle);
      form.setValue("titulo", suggestedTitle);
    }
    if (suggestedDescription) {
      console.log(`[${instanceId.current}] Updating RHF description with suggestion:`, suggestedDescription);
      form.setValue("descricao", suggestedDescription);
    }
  }, [suggestedTitle, suggestedDescription, form.setValue]);

  // Effect to update react-hook-form's link_dropbox when our state.fileUrl changes
  useEffect(() => {
    if (state.fileUrl) {
      console.log(`[${instanceId.current}] Updating RHF link_dropbox with:`, state.fileUrl);
      form.setValue("link_dropbox", state.fileUrl);
    } else {
      // Only clear if it's not an existing article being edited that might have an external link
      if (!state.articleIdToEdit) {
        console.log(`[${instanceId.current}] Clearing RHF link_dropbox`);
        form.setValue("link_dropbox", "");
      }
    }
  }, [state.fileUrl, form.setValue, state.articleIdToEdit]);

  // Update local processing progress from uploadHandler
  useEffect(() => {
    dispatch({ type: "UPDATE_PROCESSING_PROGRESS", payload: uploadHandler.processingProgress });
  }, [uploadHandler.processingProgress]);

  // Update local upload error from uploadHandler
  useEffect(() => {
    dispatch({ type: "SET_UPLOAD_ERROR", payload: uploadHandler.uploadError });
  }, [uploadHandler.uploadError]);


  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`[${instanceId.current}] File input changed by user`);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Reset data related to previous file before processing new one
      resetExtractedData();
      form.setValue("titulo", ""); // Clear fields that might be auto-filled by AI
      form.setValue("descricao", "");
      uploadHandler.handleFileChange(e); // Let useUploadHandler manage its state for the new file
      dispatch({ type: "FILE_INPUT_CHANGE", payload: selectedFile });
    }
  }, [form, resetExtractedData, uploadHandler.handleFileChange]);


  const onSubmit = async (values: FormValues) => {
    dispatch({ type: "SUBMIT_FORM_DATA" });
    try {
      console.log("Submitting RHF form with values:", values);

      let newFilePath = null;
      let shouldResetStatusToPendente = false;

      // Handle file replacement logic
      if (state.isReplacingFile && state.file && state.fileUrl && state.articleIdToEdit) {
        console.log(`Replacing file. Old path: ${state.originalFilePath}, New URL: ${state.fileUrl}`);
        if (state.originalFilePath) {
          const deleteResult = await UnifiedDocumentService.deleteStorageFile(state.originalFilePath);
          if (!deleteResult.success) {
            // Log error but attempt to continue, as new file might be more important
            console.warn("Failed to delete old file from storage:", deleteResult.error);
            toast.warning("Atenção", { description: "Não foi possível remover o arquivo PDF antigo do armazenamento, mas o novo será salvo." });
          }
        }
        newFilePath = state.fileUrl.replace(`${SUPABASE_BASE_URL}/storage/v1/object/public/documents/`, '');
        shouldResetStatusToPendente = true; // New file content means AI needs to re-process
      } else if (state.file && state.fileUrl && !state.articleIdToEdit) {
        // This is a new article with a new file
        newFilePath = state.fileUrl.replace(`${SUPABASE_BASE_URL}/storage/v1/object/public/documents/`, '');
        shouldResetStatusToPendente = true; // New file always needs processing
      } else if (state.articleIdToEdit && !state.isReplacingFile) {
        // Editing existing article, no file change by user through "replace" flow
        // Keep existing file_path from original article data if no new file was selected.
        newFilePath = state.originalFilePath; // Or articleData?.file_path from initial load
      }
      // If it's a link_dropbox scenario without a file, newFilePath will be null or the link itself if handled differently.
      // For now, assuming link_dropbox is handled by the form field directly if no actual file is being uploaded.

      const articlePayload: Partial<UnifiedDocument> = {
        titulo_extraido: values.titulo,
        texto_completo: values.descricao || null,
        equipamento_id: values.equipamento_id === "none" || !values.equipamento_id ? null : values.equipamento_id,
        tipo_documento: 'artigo_cientifico' as const,
        file_path: newFilePath,
        palavras_chave: extractedKeywords || [],
        autores: extractedResearchers || [],
        // idioma_original: values.idioma_original, // Ensure this is part of payload if needed
      };

      if (shouldResetStatusToPendente) {
        articlePayload.status_processamento = 'pendente' as const;
      } else if (state.articleIdToEdit) {
        // If not replacing file for an existing doc, don't change status unless other fields imply it.
        // For simplicity, we'll let the backend/updateDocument decide if status needs changing based on other fields.
        // Or, explicitly keep current status if no file change:
        // articlePayload.status_processamento = articleData?.status_processamento || 'pendente';
      }


      console.log("Constructed article payload:", articlePayload);

      let savedArticleData;
      if (state.articleIdToEdit) {
        savedArticleData = await unifiedDocumentService.updateDocument(state.articleIdToEdit, articlePayload);
        console.log("Article updated successfully:", savedArticleData);
        if (shouldResetStatusToPendente && savedArticleData.file_path) {
             // If we replaced the file, trigger AI processing for the updated document
            try {
                await unifiedDocumentService.processDocument(savedArticleData.id);
                console.log("Re-processing initiated for updated document:", savedArticleData.id);
            } catch (processError) {
                console.warn("Re-processing failed post-update, but document was saved:", processError);
            }
        }
      } else { // Creating new article
        savedArticleData = await unifiedDocumentService.createDocument(articlePayload);
        console.log("Article created successfully:", savedArticleData);
        if (shouldResetStatusToPendente && savedArticleData.file_path) { // New file uploaded
          try {
            await unifiedDocumentService.processDocument(savedArticleData.id);
            console.log("Auto-processing initiated for new document:", savedArticleData.id);
          } catch (processError) {
            console.warn("Auto-processing failed post-creation, but document was saved:", processError);
          }
        }
      }

      dispatch({ type: "SUBMISSION_COMPLETE", payload: savedArticleData });
      toast.success(state.articleIdToEdit ? "Artigo atualizado" : "Artigo criado", {
        description: state.articleIdToEdit
          ? "O artigo científico foi atualizado com sucesso."
          : "O novo artigo científico foi adicionado com sucesso.",
      });
      onSuccess(savedArticleData);

      dispatch({ type: "RESET_FORM_STATE" });
      form.reset(initialState); // Reset react-hook-form values
      uploadHandler.resetUploadState();
      resetExtractedData();
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error: any) {
      console.error('Error saving article:', error);
      const errorMessage = error.message || "Não foi possível salvar o artigo científico.";
      dispatch({ type: "SUBMISSION_FAILED", payload: errorMessage });
      toast.error("Erro ao salvar artigo", { description: errorMessage });
    }
  };

  const handleCancelForm = useCallback(() => {
    console.log(`[${instanceId.current}] Canceling and clearing form`);
    dispatch({ type: "RESET_FORM_STATE" });
    form.reset(initialState); // Reset react-hook-form
    uploadHandler.resetUploadState();
    resetExtractedData();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onCancel(); // Call external cancel handler
  }, [form.reset, uploadHandler.resetUploadState, resetExtractedData, onCancel]);

  const handleClearLocalFile = useCallback(() => {
    console.log(`[${instanceId.current}] Clearing local file selection`);
    dispatch({ type: "CLEAR_FILE" });
    uploadHandler.handleClearFile(); // Propagate to uploadHandler
    resetExtractedData(); // Clear any data from this file
    form.setValue("titulo", ""); // Clear AI-filled fields
    form.setValue("descricao", "");
    // Note: link_dropbox might need specific handling if it was an external link
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [form, resetExtractedData, uploadHandler.handleClearFile]);


  // Derived states for UI
  const isLoading = state.status === "SUBMITTING";
  const isProcessingFile = state.status === "AI_PROCESSING" || uploadHandler.isProcessing; // Combine local status with handler's status
  const currentUploadError = state.uploadError || state.submissionError; // Combine errors for display

  return {
    form, // react-hook-form instance
    // State properties from reducer
    status: state.status,
    file: state.file,
    fileUrl: state.fileUrl,
    isLoading, // Derived: true if status is SUBMITTING
    isProcessing: isProcessingFile, // Derived: true if status is AI_PROCESSING or useUploadHandler.isProcessing
    uploadError: currentUploadError,
    processingProgress: state.processingProgressMessage || uploadHandler.processingProgress, // Show our message or handler's
    processingFailed: state.aiProcessingFailed || uploadHandler.processingFailed, // Combine

    // From other hooks, passed through
    equipments,
    extractedKeywords,
    extractedResearchers,
    suggestedTitle,
    suggestedDescription,

    // Refs
    fileInputRef,

    // Callbacks
    onFileChange,
    onSubmit: form.handleSubmit(onSubmit), // Wrapped with RHF handleSubmit
    handleFileUpload: uploadHandler.handleFileUpload, // Expose if direct trigger needed
    handleClearFile: handleClearLocalFile, // Use our wrapped version
    handleCancel: handleCancelForm, // Use our wrapped version
    initiateReplaceFile: () => dispatch({ type: "INITIATE_REPLACE_FILE" }), // New callback
  };
}
