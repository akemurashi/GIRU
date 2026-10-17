import { useCallback } from 'react';
import { useUpdateDocument, useToggleDocumentActive, useDeleteDocument, type DocumentUpdateData } from '../services/documentService';

/**
 * Custom hook for document manipulation operations
 * Provides a unified interface for common document operations
 */
export const useDocumentManipulation = () => {
  const updateDocumentMutation = useUpdateDocument();
  const toggleActiveMutation = useToggleDocumentActive();
  const deleteDocumentMutation = useDeleteDocument();

  /**
   * Update document metadata
   */
  const updateDocument = useCallback((id: string | number, data: DocumentUpdateData) => {
    return updateDocumentMutation.mutateAsync({ id: String(id), data });
  }, [updateDocumentMutation]);

  /**
   * Toggle document active status
   */
  const toggleActive = useCallback((id: string | number) => {
    return toggleActiveMutation.mutateAsync(String(id));
  }, [toggleActiveMutation]);

  /**
   * Delete document
   */
  const deleteDocument = useCallback((id: string | number) => {
    return deleteDocumentMutation.mutateAsync(String(id));
  }, [deleteDocumentMutation]);

  /**
   * Quick status update helper
   */
  const updateStatus = useCallback((id: string | number, statusId: number) => {
    return updateDocument(id, { idestadovigencia: statusId });
  }, [updateDocument]);

  /**
   * Quick category update helper
   */
  const updateCategory = useCallback((id: string | number, categoryId: number) => {
    return updateDocument(id, { idcategoria: categoryId });
  }, [updateDocument]);

  /**
   * Quick title update helper
   */
  const updateTitle = useCallback((id: string | number, title: string) => {
    return updateDocument(id, { titulo: title });
  }, [updateDocument]);

  return {
    // Mutations
    updateDocument,
    toggleActive,
    deleteDocument,
    
    // Quick helpers
    updateStatus,
    updateCategory,
    updateTitle,
    
    // Loading states
    isUpdating: updateDocumentMutation.isPending,
    isToggling: toggleActiveMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
    
    // Error states
    updateError: updateDocumentMutation.error,
    toggleError: toggleActiveMutation.error,
    deleteError: deleteDocumentMutation.error,
  };
};