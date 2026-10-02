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
  const updateDocument = useCallback((id: number, data: DocumentUpdateData) => {
    return updateDocumentMutation.mutateAsync({ id, data });
  }, [updateDocumentMutation]);

  /**
   * Toggle document active status
   */
  const toggleActive = useCallback((id: number) => {
    return toggleActiveMutation.mutateAsync(id);
  }, [toggleActiveMutation]);

  /**
   * Delete document
   */
  const deleteDocument = useCallback((id: number) => {
    return deleteDocumentMutation.mutateAsync(id);
  }, [deleteDocumentMutation]);

  /**
   * Quick status update helper
   */
  const updateStatus = useCallback((id: number, statusId: number) => {
    return updateDocument(id, { idestadovigencia: statusId });
  }, [updateDocument]);

  /**
   * Quick category update helper
   */
  const updateCategory = useCallback((id: number, categoryId: number) => {
    return updateDocument(id, { idcategoria: categoryId });
  }, [updateDocument]);

  /**
   * Quick title update helper
   */
  const updateTitle = useCallback((id: number, title: string) => {
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